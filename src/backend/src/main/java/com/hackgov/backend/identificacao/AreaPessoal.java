package com.hackgov.backend.identificacao;

import com.hackgov.backend.domain.Agendamento;
import com.hackgov.backend.domain.Encaminhamento;
import com.hackgov.backend.domain.StatusAgendamento;
import com.hackgov.backend.domain.StatusEncaminhamento;
import com.hackgov.backend.memoria.AcervoMinhaVez;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class AreaPessoal {

    private static final StatusEncaminhamento[] TRILHA = {
            StatusEncaminhamento.RECEBIDO_TRIADO,
            StatusEncaminhamento.AGUARDANDO_AGENDAMENTO,
            StatusEncaminhamento.AGENDADO,
            StatusEncaminhamento.CONCLUIDO
    };

    private final AcervoMinhaVez acervo;

    public AreaPessoal(AcervoMinhaVez acervo) {
        this.acervo = acervo;
    }

    public AreaPessoalResposta de(Long cidadaoId) {
        List<EncaminhamentoResposta> itens = new ArrayList<>();

        for (Encaminhamento encaminhamento : acervo.encaminhamentosDe(cidadaoId)) {
            itens.add(traduzir(encaminhamento));
        }

        if (itens.isEmpty()) {
            return new AreaPessoalResposta(
                    false,
                    "SEM_ENCAMINHAMENTO",
                    "Você não tem encaminhamento em andamento.",
                    List.of()
            );
        }

        return new AreaPessoalResposta(true, "COM_ENCAMINHAMENTO", null, List.copyOf(itens));
    }

    private EncaminhamentoResposta traduzir(Encaminhamento encaminhamento) {
        List<AgendamentoResposta> agendamentos = new ArrayList<>();
        HorarioMarcadoResposta horarioMarcado = null;

        for (Agendamento agendamento : encaminhamento.getAgendamentos()) {
            agendamentos.add(new AgendamentoResposta(
                    agendamento.getId(),
                    agendamento.getDataHora(),
                    agendamento.getStatus().name()
            ));

            if (agendamento.getStatus() == StatusAgendamento.AGENDADO) {
                horarioMarcado = new HorarioMarcadoResposta(
                        agendamento.getId(),
                        agendamento.getDataHora()
                );
            }
        }

        StatusEncaminhamento status = encaminhamento.getStatus();

        return new EncaminhamentoResposta(
                encaminhamento.getProtocolo(),
                status.name(),
                rotulo(status),
                encaminhamento.getEspecialidade().getNome(),
                encaminhamento.getUnidadeDestino().getNome(),
                encaminhamento.podeAgendar(),
                status == StatusEncaminhamento.AGENDADO && horarioMarcado != null,
                proximoPasso(status),
                horarioMarcado,
                trilha(status),
                List.copyOf(agendamentos)
        );
    }

    private static List<EtapaResposta> trilha(StatusEncaminhamento atual) {
        int indiceAtual = indice(atual);
        List<EtapaResposta> etapas = new ArrayList<>();

        for (int i = 0; i < TRILHA.length; i++) {
            String situacao;

            if (i < indiceAtual) {
                situacao = "CONCLUIDA";
            } else if (i == indiceAtual) {
                situacao = "ATUAL";
            } else {
                situacao = "PENDENTE";
            }

            etapas.add(new EtapaResposta(TRILHA[i].name(), rotulo(TRILHA[i]), situacao));
        }

        return List.copyOf(etapas);
    }

    private static int indice(StatusEncaminhamento status) {
        for (int i = 0; i < TRILHA.length; i++) {
            if (TRILHA[i] == status) {
                return i;
            }
        }

        return 0;
    }

    private static String proximoPasso(StatusEncaminhamento status) {
        return switch (status) {
            case RECEBIDO_TRIADO -> "Aguarde a liberação dos horários.";
            case AGUARDANDO_AGENDAMENTO -> "Já é possível escolher um horário no aplicativo.";
            case AGENDADO -> "O horário está marcado. Para reagendar ou cancelar, use o aplicativo.";
            case CONCLUIDO -> "Este encaminhamento está concluído.";
        };
    }

    public static String rotulo(StatusEncaminhamento status) {
        return switch (status) {
            case RECEBIDO_TRIADO -> "Recebido e triado";
            case AGUARDANDO_AGENDAMENTO -> "Aguardando agendamento";
            case AGENDADO -> "Agendado";
            case CONCLUIDO -> "Concluído";
        };
    }
}
