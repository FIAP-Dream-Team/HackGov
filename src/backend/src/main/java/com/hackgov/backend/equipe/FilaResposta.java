package com.hackgov.backend.equipe;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record FilaResposta(
        String mensagem,
        List<EspecialidadeFilaResposta> especialidades,
        Long esperaMediaSegundos,
        String mensagemEspera,
        Integer faltas,
        Integer agendamentos,
        Integer taxaFaltasPercentual,
        String mensagemFaltas
) {
}
