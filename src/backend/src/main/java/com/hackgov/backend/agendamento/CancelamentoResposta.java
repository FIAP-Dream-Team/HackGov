package com.hackgov.backend.agendamento;

public record CancelamentoResposta(
        String protocolo,
        String status,
        String mensagem
) {
}
