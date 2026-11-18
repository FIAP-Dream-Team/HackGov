package com.hackgov.backend.controller;

import com.hackgov.backend.api.ApiException;
import com.hackgov.backend.equipe.PedidoDeStatus;
import com.hackgov.backend.equipe.PedidoLoginEquipe;
import com.hackgov.backend.equipe.RespostaLoginEquipe;
import com.hackgov.backend.equipe.ServicoDeEquipe;
import com.hackgov.backend.equipe.StatusAtualizadoResposta;
import com.hackgov.backend.painel.PainelResposta;
import com.hackgov.backend.painel.PedidoDeChamada;
import com.hackgov.backend.painel.ServicoDePainel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/equipe")
public class EquipeController {

    private static final String BEARER = "Bearer ";

    private final ServicoDeEquipe equipe;
    private final ServicoDePainel painel;

    public EquipeController(ServicoDeEquipe equipe, ServicoDePainel painel) {
        this.equipe = equipe;
        this.painel = painel;
    }

    @PostMapping("/login")
    public RespostaLoginEquipe login(@RequestBody PedidoLoginEquipe pedido) {
        return equipe.entrar(pedido);
    }

    @PostMapping("/encaminhamentos/{protocolo}/status")
    public StatusAtualizadoResposta atualizarStatus(
            @RequestHeader(value = "Authorization", required = false) String autorizacao,
            @PathVariable String protocolo,
            @RequestBody PedidoDeStatus pedido) {
        return equipe.atualizarStatus(tokenDe(autorizacao), protocolo, pedido);
    }

    @PostMapping("/encaminhamentos/{protocolo}/chamada")
    public ResponseEntity<PainelResposta> chamar(
            @RequestHeader(value = "Authorization", required = false) String autorizacao,
            @PathVariable String protocolo,
            @RequestBody(required = false) PedidoDeChamada pedido) {
        return ResponseEntity.status(201).body(painel.chamar(tokenDe(autorizacao), protocolo, pedido));
    }

    private static String tokenDe(String autorizacao) {
        if (autorizacao == null || autorizacao.isBlank() || !autorizacao.startsWith(BEARER)) {
            throw new ApiException(
                    401,
                    "SESSAO_AUSENTE",
                    "Não há sessão de equipe ativa. Entre de novo."
            );
        }

        String token = autorizacao.substring(BEARER.length()).trim();

        if (token.isEmpty()) {
            throw new ApiException(
                    401,
                    "SESSAO_AUSENTE",
                    "Não há sessão de equipe ativa. Entre de novo."
            );
        }

        return token;
    }
}
