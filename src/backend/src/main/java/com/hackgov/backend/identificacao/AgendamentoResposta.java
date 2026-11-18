package com.hackgov.backend.identificacao;

import java.time.LocalDateTime;

public record AgendamentoResposta(
        Long id,
        LocalDateTime dataHora,
        String status
) {
}
