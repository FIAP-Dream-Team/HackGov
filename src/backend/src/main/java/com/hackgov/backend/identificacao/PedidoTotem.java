package com.hackgov.backend.identificacao;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDate;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record PedidoTotem(
        String cartaoSus,
        String cpf,
        LocalDate dataNascimento,
        String senha
) {
}
