package com.hackgov.backend.controller;

import com.hackgov.backend.agendamento.CancelamentoResposta;
import com.hackgov.backend.agendamento.ConfirmacaoResposta;
import com.hackgov.backend.agendamento.ListaDeHorariosResposta;
import com.hackgov.backend.agendamento.PedidoDeCancelamento;
import com.hackgov.backend.agendamento.PedidoDeHorario;
import com.hackgov.backend.agendamento.ServicoDeAgendamento;
import com.hackgov.backend.api.ApiException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/app/encaminhamentos/{protocolo}")
public class AgendamentoController {

    private static final String BEARER = "Bearer ";

    private final ServicoDeAgendamento agendamento;

    public AgendamentoController(ServicoDeAgendamento agendamento) {
        this.agendamento = agendamento;
    }

    @GetMapping("/horarios")
    public ListaDeHorariosResposta horarios(
            @RequestHeader(value = "Authorization", required = false) String autorizacao,
            @PathVariable String protocolo) {
        return agendamento.listar(tokenDe(autorizacao), protocolo);
    }

    @PostMapping("/agendamento")
    public ResponseEntity<ConfirmacaoResposta> agendar(
            @RequestHeader(value = "Authorization", required = false) String autorizacao,
            @PathVariable String protocolo,
            @RequestBody(required = false) PedidoDeHorario pedido) {
        return ResponseEntity.status(201).body(
                agendamento.confirmar(tokenDe(autorizacao), protocolo, pedido)
        );
    }

    @PostMapping("/cancelamento")
    public CancelamentoResposta cancelar(
            @RequestHeader(value = "Authorization", required = false) String autorizacao,
            @PathVariable String protocolo,
            @RequestBody(required = false) PedidoDeCancelamento pedido) {
        return agendamento.cancelar(tokenDe(autorizacao), protocolo, pedido);
    }

    @PostMapping("/reagendamento")
    public ResponseEntity<ConfirmacaoResposta> reagendar(
            @RequestHeader(value = "Authorization", required = false) String autorizacao,
            @PathVariable String protocolo,
            @RequestBody(required = false) PedidoDeHorario pedido) {
        return ResponseEntity.status(201).body(
                agendamento.reagendar(tokenDe(autorizacao), protocolo, pedido)
        );
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
