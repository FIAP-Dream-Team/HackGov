package com.hackgov.backend.agendamento;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ListaDeHorariosResposta(
        boolean temHorario,
        String protocolo,
        String especialidade,
        String unidade,
        String mensagem,
        List<HorarioLivreResposta> horarios
) {
}
