package com.hackgov.backend.equipe;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record FaltaRegistradaResposta(
        String protocolo,
        String acaoPendente,
        String rotuloAcao
) {
}
