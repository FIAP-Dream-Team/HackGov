package com.hackgov.backend.identificacao;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record AreaPessoalResposta(
        boolean temEncaminhamento,
        String situacao,
        String mensagem,
        List<EncaminhamentoResposta> encaminhamentos
) {
}
