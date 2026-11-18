package com.hackgov.backend.memoria;

import com.hackgov.backend.domain.Cidadao;
import com.hackgov.backend.domain.Encaminhamento;
import com.hackgov.backend.identificacao.Canal;
import com.hackgov.backend.identificacao.Credencial;
import com.hackgov.backend.identificacao.Sessao;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
public class AcervoMinhaVez {

    private final Map<Long, Cidadao> cidadaos = new HashMap<>();
    private final Map<String, Long> porCpf = new HashMap<>();
    private final Map<String, Long> porCartao = new HashMap<>();
    private final Map<Long, Credencial> credenciais = new HashMap<>();
    private final Map<String, Sessao> sessoes = new HashMap<>();
    private final List<Encaminhamento> encaminhamentos = new ArrayList<>();
    private final SecureRandom aleatorio = new SecureRandom();

    private long proximoId = 1;

    public synchronized long proximoId() {
        return proximoId++;
    }

    public synchronized void guardar(Cidadao cidadao, Credencial credencial) {
        if (cidadao == null || credencial == null) {
            throw new IllegalArgumentException("O cadastro do cidadão é obrigatório.");
        }

        if (porCpf.containsKey(cidadao.getCpf())) {
            throw new ConflitoDeCadastro(
                    "CPF_JA_CADASTRADO",
                    "Já existe um cadastro com esse CPF. Entre com a senha ou pelo Gov.br."
            );
        }

        if (cidadao.getCartaoSus() != null && porCartao.containsKey(cidadao.getCartaoSus())) {
            throw new ConflitoDeCadastro(
                    "CARTAO_JA_CADASTRADO",
                    "Já existe um cadastro com esse Cartão SUS."
            );
        }

        cidadaos.put(cidadao.getId(), cidadao);
        porCpf.put(cidadao.getCpf(), cidadao.getId());

        if (cidadao.getCartaoSus() != null) {
            porCartao.put(cidadao.getCartaoSus(), cidadao.getId());
        }

        credenciais.put(cidadao.getId(), credencial);
    }

    public synchronized Optional<Cidadao> buscarPorCpf(String cpf) {
        return buscar(porCpf.get(cpf));
    }

    public synchronized Optional<Cidadao> buscarPorCartao(String cartaoSus) {
        return buscar(porCartao.get(cartaoSus));
    }

    public synchronized Optional<Cidadao> buscarPorId(Long id) {
        return buscar(id);
    }

    public synchronized Optional<Credencial> credencialDe(Long cidadaoId) {
        return Optional.ofNullable(credenciais.get(cidadaoId));
    }

    public synchronized void adicionarEncaminhamento(Encaminhamento encaminhamento) {
        if (encaminhamento == null) {
            throw new IllegalArgumentException("O encaminhamento é obrigatório.");
        }

        encaminhamentos.add(encaminhamento);
    }

    public synchronized List<Encaminhamento> encaminhamentosDe(Long cidadaoId) {
        List<Encaminhamento> doCidadao = new ArrayList<>();

        for (Encaminhamento encaminhamento : encaminhamentos) {
            if (encaminhamento.getCidadao().getId().equals(cidadaoId)) {
                doCidadao.add(encaminhamento);
            }
        }

        return doCidadao;
    }

    public synchronized Sessao abrirSessao(Canal canal, Long cidadaoId) {
        byte[] bytes = new byte[32];
        aleatorio.nextBytes(bytes);
        String token = HexFormat.of().formatHex(bytes);
        Sessao sessao = new Sessao(token, canal, cidadaoId, LocalDateTime.now());
        sessoes.put(token, sessao);
        return sessao;
    }

    public synchronized Optional<Sessao> buscarSessao(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }

        return Optional.ofNullable(sessoes.get(token));
    }

    public synchronized boolean encerrarSessao(String token) {
        return sessoes.remove(token) != null;
    }

    public synchronized int sessoesAbertas() {
        return sessoes.size();
    }

    public synchronized void limpar() {
        cidadaos.clear();
        porCpf.clear();
        porCartao.clear();
        credenciais.clear();
        sessoes.clear();
        encaminhamentos.clear();
    }

    private Optional<Cidadao> buscar(Long id) {
        if (id == null) {
            return Optional.empty();
        }

        return Optional.ofNullable(cidadaos.get(id));
    }
}
