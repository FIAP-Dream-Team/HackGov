package com.hackgov.backend.controller;

import com.hackgov.backend.painel.PainelResposta;
import com.hackgov.backend.painel.ServicoDePainel;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/painel")
public class PainelController {

    private final ServicoDePainel painel;

    public PainelController(ServicoDePainel painel) {
        this.painel = painel;
    }

    @GetMapping
    public PainelResposta atual() {
        return painel.atual();
    }

    @GetMapping(path = "/eventos", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter eventos() {
        return painel.abrirEventos();
    }
}
