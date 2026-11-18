package com.hackgov.backend.equipe;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ItemFilaResposta(
        String protocolo,
        String nome,
        String status,
        String acaoPendente,
        String rotuloAcao
) {
}
