package com.hackgov.backend.equipe;

import com.hackgov.backend.api.ApiException;
import com.hackgov.backend.domain.AcaoPendente;
import com.hackgov.backend.domain.Agendamento;
import com.hackgov.backend.domain.Encaminhamento;
import com.hackgov.backend.domain.StatusAgendamento;
import com.hackgov.backend.domain.UsuarioInstitucional;
import com.hackgov.backend.memoria.AcervoMinhaVez;
import com.hackgov.backend.painel.AtualizacaoDoPainel;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Fila da equipe. A ação pendente e os dois indicadores são calculados,
 * não gravados. A espera média é a última permanência em AGUARDANDO_AGENDAMENTO,
 * em segundos inteiros, fechada na troca de status ou na consulta se o
 * encaminhamento ainda espera. A taxa de faltas ignora agendamento cancelado.
 * "Buscar resultado" não tem fonte no modelo.
 */
@Service
public class ServicoDeFila {

    private static final String FILA_VAZIA = "Nenhum encaminhamento nesta unidade.";
    private static final String SEM_ESPERA = "Ainda não há espera medida.";
    private static final String SEM_FALTAS = "Ainda não há agendamento para calcular a taxa de faltas.";

    private final AcervoMinhaVez acervo;
    private final AtualizacaoDoPainel painel;

    public ServicoDeFila(AcervoMinhaVez acervo, AtualizacaoDoPainel painel) {
        this.acervo = acervo;
        this.painel = painel;
    }

    public FilaResposta consultar(String token, String especialidade) {
        UsuarioInstitucional usuario = equipeDe(token);
        String filtro = normalizar(especialidade);
        List<Encaminhamento> considerados = new ArrayList<>();
        Map<String, List<ItemFilaResposta>> porNome = new LinkedHashMap<>();

        for (Encaminhamento encaminhamento : acervo.encaminhamentos()) {
            if (!usuario.getUnidade().equals(encaminhamento.getUnidadeOrigem())) {
                continue;
            }

            String nome = encaminhamento.getEspecialidade().getNome();

            if (filtro != null && !filtro.equals(nome)) {
                continue;
            }

            considerados.add(encaminhamento);
            porNome.computeIfAbsent(nome, chave -> new ArrayList<>())
                    .add(itemDe(encaminhamento));
        }

        List<EspecialidadeFilaResposta> grupos = new ArrayList<>();
        List<String> nomes = new ArrayList<>(porNome.keySet());
        nomes.sort(String::compareTo);

        for (String nome : nomes) {
            grupos.add(new EspecialidadeFilaResposta(nome, List.copyOf(porNome.get(nome))));
        }

        String mensagem = null;

        if (filtro != null && grupos.isEmpty()) {
            grupos.add(new EspecialidadeFilaResposta(filtro, List.of()));
        } else if (grupos.isEmpty()) {
            mensagem = FILA_VAZIA;
        }

        return montar(mensagem, grupos, considerados);
    }

    public FaltaRegistradaResposta registrarFalta(String token, String protocolo) {
        UsuarioInstitucional usuario = equipeDe(token);
        Encaminhamento encaminhamento = acervo.buscarEncaminhamentoPorProtocolo(protocolo).orElseThrow(
                () -> new ApiException(
                        404,
                        "ENCAMINHAMENTO_NAO_ENCONTRADO",
                        "Não encontramos esse encaminhamento."
                )
        );

        if (!usuario.getUnidade().equals(encaminhamento.getUnidadeOrigem())) {
            throw new ApiException(
                    403,
                    "ACESSO_NEGADO",
                    "Este encaminhamento é de outra unidade."
            );
        }

        usuario.registrarFalta(encaminhamento);
        painel.painelMudou();

        AcaoPendente acao = encaminhamento.acaoPendente();

        return new FaltaRegistradaResposta(
                encaminhamento.getProtocolo(),
                acao == null ? null : acao.name(),
                acao == null ? null : acao.getRotulo()
        );
    }

    private FilaResposta montar(
            String mensagem,
            List<EspecialidadeFilaResposta> grupos,
            List<Encaminhamento> considerados) {
        long soma = 0;
        int amostras = 0;
        int faltas = 0;
        int agendamentos = 0;

        for (Encaminhamento encaminhamento : considerados) {
            Optional<Duration> espera = encaminhamento.esperaParaAgendar();

            if (espera.isPresent()) {
                soma += espera.get().toSeconds();
                amostras++;
            }

            for (Agendamento agendamento : encaminhamento.getAgendamentos()) {
                if (agendamento.getStatus() == StatusAgendamento.CANCELADO) {
                    continue;
                }

                agendamentos++;

                if (agendamento.getStatus() == StatusAgendamento.FALTA) {
                    faltas++;
                }
            }
        }

        Long media = amostras == 0 ? null : soma / amostras;
        boolean temTaxa = agendamentos > 0;

        return new FilaResposta(
                mensagem,
                List.copyOf(grupos),
                media,
                media == null ? SEM_ESPERA : null,
                temTaxa ? faltas : null,
                temTaxa ? agendamentos : null,
                temTaxa ? (int) Math.round(100.0 * faltas / agendamentos) : null,
                temTaxa ? null : SEM_FALTAS
        );
    }

    private static ItemFilaResposta itemDe(Encaminhamento encaminhamento) {
        AcaoPendente acao = encaminhamento.acaoPendente();

        return new ItemFilaResposta(
                encaminhamento.getProtocolo(),
                encaminhamento.getCidadao().getNome(),
                encaminhamento.getStatus().name(),
                acao == null ? null : acao.name(),
                acao == null ? null : acao.getRotulo()
        );
    }

    private UsuarioInstitucional equipeDe(String token) {
        if (acervo.buscarSessao(token).isPresent()) {
            throw new ApiException(
                    403,
                    "ACESSO_NEGADO",
                    "A fila da equipe é do canal institucional."
            );
        }

        return acervo.buscarEquipePorToken(token).orElseThrow(
                () -> new ApiException(
                        401,
                        "SESSAO_INVALIDA",
                        "Não há sessão de equipe ativa. Entre de novo."
                )
        );
    }

    private static String normalizar(String especialidade) {
        if (especialidade == null || especialidade.isBlank()) {
            return null;
        }

        return especialidade.trim();
    }
}
