package com.hackgov.backend.controller;

import com.hackgov.backend.api.ApiException;
import com.hackgov.backend.identificacao.PedidoCadastro;
import com.hackgov.backend.identificacao.PedidoLogin;
import com.hackgov.backend.identificacao.PedidoOauth;
import com.hackgov.backend.identificacao.PedidoTotem;
import com.hackgov.backend.identificacao.RespostaDeIdentificacao;
import com.hackgov.backend.identificacao.ServicoDeIdentificacao;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class IdentificacaoController {

    private static final String BEARER = "Bearer ";

    private final ServicoDeIdentificacao identificacao;

    public IdentificacaoController(ServicoDeIdentificacao identificacao) {
        this.identificacao = identificacao;
    }

    @PostMapping("/totem/identificacao")
    public RespostaDeIdentificacao totem(@RequestBody PedidoTotem pedido) {
        return identificacao.identificarNoTotem(pedido);
    }

    @PostMapping("/app/cadastro")
    public ResponseEntity<RespostaDeIdentificacao> cadastro(@RequestBody PedidoCadastro pedido) {
        return ResponseEntity.status(201).body(identificacao.cadastrarNoApp(pedido));
    }

    @PostMapping("/app/login")
    public RespostaDeIdentificacao login(@RequestBody PedidoLogin pedido) {
        return identificacao.entrarNoApp(pedido);
    }

    @PostMapping("/app/oauth")
    public RespostaDeIdentificacao oauth(@RequestBody PedidoOauth pedido) {
        return identificacao.entrarPeloGovBr(pedido);
    }

    @GetMapping("/sessoes/atual")
    public RespostaDeIdentificacao atual(
            @RequestHeader(value = "Authorization", required = false) String autorizacao) {
        return identificacao.areaDaSessao(tokenDe(autorizacao));
    }

    @DeleteMapping("/sessoes/atual")
    public ResponseEntity<Void> encerrar(
            @RequestHeader(value = "Authorization", required = false) String autorizacao) {
        identificacao.encerrar(tokenDe(autorizacao));
        return ResponseEntity.noContent().build();
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
