package com.hackgov.backend.equipe;

import java.util.List;

public record EspecialidadeFilaResposta(
        String especialidade,
        List<ItemFilaResposta> encaminhamentos
) {
}
