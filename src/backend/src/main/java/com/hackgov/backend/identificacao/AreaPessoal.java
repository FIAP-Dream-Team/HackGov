package com.hackgov.backend.identificacao;

import com.hackgov.backend.domain.Agendamento;
import com.hackgov.backend.domain.Encaminhamento;
import com.hackgov.backend.domain.StatusEncaminhamento;
import com.hackgov.backend.memoria.AcervoMinhaVez;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class AreaPessoal {

    private final AcervoMinhaVez acervo;

    public AreaPessoal(AcervoMinhaVez acervo) {
        this.acervo = acervo;
    }

    public AreaPessoalResposta de(Long cidadaoId) {
        List<EncaminhamentoResposta> itens = new ArrayList<>();

        for (Encaminhamento encaminhamento : acervo.encaminhamentosDe(cidadaoId)) {
            itens.add(traduzir(encaminhamento));
        }

        return new AreaPessoalResposta(!itens.isEmpty(), List.copyOf(itens));
    }

    private EncaminhamentoResposta traduzir(Encaminhamento encaminhamento) {
        List<AgendamentoResposta> agendamentos = new ArrayList<>();

        for (Agendamento agendamento : encaminhamento.getAgendamentos()) {
            agendamentos.add(new AgendamentoResposta(
                    agendamento.getId(),
                    agendamento.getDataHora(),
                    agendamento.getStatus().name()
            ));
        }

        return new EncaminhamentoResposta(
                encaminhamento.getProtocolo(),
                encaminhamento.getStatus().name(),
                rotulo(encaminhamento.getStatus()),
                encaminhamento.getEspecialidade().getNome(),
                encaminhamento.getUnidadeDestino().getNome(),
                List.copyOf(agendamentos)
        );
    }

    private static String rotulo(StatusEncaminhamento status) {
        return switch (status) {
            case RECEBIDO_TRIADO -> "Recebido e triado";
            case AGUARDANDO_AGENDAMENTO -> "Aguardando agendamento";
            case AGENDADO -> "Agendado";
            case CONCLUIDO -> "Concluído";
        };
    }
}
