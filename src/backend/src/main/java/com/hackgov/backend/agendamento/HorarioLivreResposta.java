package com.hackgov.backend.agendamento;

public record HorarioLivreResposta(
        Long id,
        String data,
        String hora,
        String especialidade,
        String unidade
) {
}
