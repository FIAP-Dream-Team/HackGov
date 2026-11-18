package com.hackgov.backend.memoria;

import com.hackgov.backend.domain.Chamada;
import com.hackgov.backend.domain.Cidadao;
import com.hackgov.backend.domain.Encaminhamento;
import com.hackgov.backend.domain.StatusAgendamento;
import com.hackgov.backend.domain.UsuarioInstitucional;
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
    private final Map<Long, UsuarioInstitucional> equipe = new HashMap<>();
    private final Map<String, Long> equipePorLogin = new HashMap<>();
    private final Map<Long, Credencial> credenciaisEquipe = new HashMap<>();
    private final Map<String, Long> sessoesEquipe = new HashMap<>();
    private final List<Encaminhamento> encaminhamentos = new ArrayList<>();
    private final List<Chamada> chamadas = new ArrayList<>();
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

    public synchronized List<Encaminhamento> encaminhamentos() {
        return List.copyOf(encaminhamentos);
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

    public synchronized Optional<Encaminhamento> buscarEncaminhamentoPorProtocolo(String protocolo) {
        if (protocolo == null || protocolo.isBlank()) {
            return Optional.empty();
        }

        for (Encaminhamento encaminhamento : encaminhamentos) {
            if (encaminhamento.getProtocolo().equals(protocolo)) {
                return Optional.of(encaminhamento);
            }
        }

        return Optional.empty();
    }

    public synchronized void guardarEquipe(UsuarioInstitucional usuario, Credencial credencial) {
        if (usuario == null || credencial == null) {
            throw new IllegalArgumentException("O cadastro da equipe é obrigatório.");
        }

        if (equipePorLogin.containsKey(usuario.getLogin())) {
            throw new ConflitoDeCadastro(
                    "LOGIN_JA_CADASTRADO",
                    "Já existe um usuário da equipe com esse login."
            );
        }

        equipe.put(usuario.getId(), usuario);
        equipePorLogin.put(usuario.getLogin(), usuario.getId());
        credenciaisEquipe.put(usuario.getId(), credencial);
    }

    public synchronized Optional<UsuarioInstitucional> buscarEquipePorLogin(String login) {
        Long id = equipePorLogin.get(login);
        if (id == null) {
            return Optional.empty();
        }

        return Optional.ofNullable(equipe.get(id));
    }

    public synchronized Optional<Credencial> credencialEquipe(Long usuarioId) {
        return Optional.ofNullable(credenciaisEquipe.get(usuarioId));
    }

    public synchronized String abrirSessaoEquipe(Long usuarioId) {
        byte[] bytes = new byte[32];
        aleatorio.nextBytes(bytes);
        String token = HexFormat.of().formatHex(bytes);
        sessoesEquipe.put(token, usuarioId);
        return token;
    }

    public synchronized Optional<UsuarioInstitucional> buscarEquipePorToken(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }

        Long id = sessoesEquipe.get(token);
        if (id == null) {
            return Optional.empty();
        }

        return Optional.ofNullable(equipe.get(id));
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

    public synchronized void adicionarChamada(Chamada chamada) {
        if (chamada == null) {
            throw new IllegalArgumentException("A chamada é obrigatória.");
        }

        chamadas.add(chamada);
    }

    public synchronized Optional<Chamada> chamadaAtiva() {
        if (chamadas.isEmpty()) {
            return Optional.empty();
        }

        Chamada ultima = chamadas.get(chamadas.size() - 1);

        if (ultima.getAgendamento().getStatus() != StatusAgendamento.AGENDADO) {
            return Optional.empty();
        }

        return Optional.of(ultima);
    }

    public synchronized List<Chamada> chamadas() {
        return List.copyOf(chamadas);
    }

    public synchronized void limpar() {
        cidadaos.clear();
        porCpf.clear();
        porCartao.clear();
        credenciais.clear();
        sessoes.clear();
        encaminhamentos.clear();
        equipe.clear();
        equipePorLogin.clear();
        credenciaisEquipe.clear();
        sessoesEquipe.clear();
        chamadas.clear();
    }

    private Optional<Cidadao> buscar(Long id) {
        if (id == null) {
            return Optional.empty();
        }

        return Optional.ofNullable(cidadaos.get(id));
    }
}
