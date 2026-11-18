package com.hackgov.backend.identificacao;

import java.util.List;

public record AreaPessoalResposta(
        boolean temEncaminhamento,
        List<EncaminhamentoResposta> encaminhamentos
) {
}
