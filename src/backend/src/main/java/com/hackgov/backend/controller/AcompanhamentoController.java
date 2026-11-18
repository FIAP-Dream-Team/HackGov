package com.hackgov.backend.controller;

import com.hackgov.backend.api.ApiException;
import com.hackgov.backend.identificacao.AreaPessoalResposta;
import com.hackgov.backend.identificacao.ServicoDeIdentificacao;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AcompanhamentoController {

    private static final String BEARER = "Bearer ";

    private final ServicoDeIdentificacao identificacao;

    public AcompanhamentoController(ServicoDeIdentificacao identificacao) {
        this.identificacao = identificacao;
    }

    @GetMapping("/acompanhamento")
    public AreaPessoalResposta acompanhar(
            @RequestHeader(value = "Authorization", required = false) String autorizacao) {
        return identificacao.acompanhamento(tokenDe(autorizacao));
    }

    private static String tokenDe(String autorizacao) {
        if (autorizacao == null || autorizacao.isBlank() || !autorizacao.startsWith(BEARER)) {
            throw new ApiException(
                    401,
                    "SESSAO_AUSENTE",
                    "Não há sessão ativa. Identifique-se de novo."
            );
        }

        String token = autorizacao.substring(BEARER.length()).trim();

        if (token.isEmpty()) {
            throw new ApiException(
                    401,
                    "SESSAO_AUSENTE",
                    "Não há sessão ativa. Identifique-se de novo."
            );
        }

        return token;
    }
}
