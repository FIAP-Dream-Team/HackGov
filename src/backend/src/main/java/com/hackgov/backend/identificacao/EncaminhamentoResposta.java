package com.hackgov.backend.identificacao;

import java.util.List;

public record EncaminhamentoResposta(
        String protocolo,
        String status,
        String rotulo,
        String especialidade,
        String unidadeDestino,
        List<AgendamentoResposta> agendamentos
) {
}
