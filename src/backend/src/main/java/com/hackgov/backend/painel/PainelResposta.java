package com.hackgov.backend.painel;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record PainelResposta(
        boolean temChamada,
        String senha,
        String sala,
        String estado,
        String cor,
        String mensagem
) {
}
