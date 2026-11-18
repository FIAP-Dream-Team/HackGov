package com.hackgov.backend.agendamento;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ConfirmacaoResposta(
        String protocolo,
        String especialidade,
        String data,
        String hora,
        String unidade,
        String status,
        Long agendamentoId,
        Long agendamentoAnteriorId,
        String mensagem
) {
}
