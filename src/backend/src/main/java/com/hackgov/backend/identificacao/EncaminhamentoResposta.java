package com.hackgov.backend.identificacao;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record EncaminhamentoResposta(
        String protocolo,
        String status,
        String rotulo,
        String especialidade,
        String unidadeDestino,
        boolean podeAgendar,
        boolean podeAlterarHorario,
        String proximoPasso,
        HorarioMarcadoResposta horarioMarcado,
        List<EtapaResposta> trilha,
        List<AgendamentoResposta> agendamentos
) {
}
