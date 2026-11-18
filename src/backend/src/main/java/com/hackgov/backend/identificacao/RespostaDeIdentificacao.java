package com.hackgov.backend.identificacao;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record RespostaDeIdentificacao(
        String token,
        String canal,
        String provedor,
        Boolean oauthSimulado,
        AreaPessoalResposta areaPessoal
) {
}
