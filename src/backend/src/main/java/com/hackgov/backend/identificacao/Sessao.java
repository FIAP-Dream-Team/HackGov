package com.hackgov.backend.identificacao;

import java.time.LocalDateTime;

public final class Sessao {

    private final String token;
    private final Canal canal;
    private final Long cidadaoId;
    private final LocalDateTime criadaEm;

    public Sessao(String token, Canal canal, Long cidadaoId, LocalDateTime criadaEm) {
        this.token = token;
        this.canal = canal;
        this.cidadaoId = cidadaoId;
        this.criadaEm = criadaEm;
    }

    public String getToken() {
        return token;
    }

    public Canal getCanal() {
        return canal;
    }

    public Long getCidadaoId() {
        return cidadaoId;
    }

    public LocalDateTime getCriadaEm() {
        return criadaEm;
    }
}
