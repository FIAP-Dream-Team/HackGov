package com.hackgov.backend.identificacao;

import java.time.LocalDate;

public record PedidoOauth(
        String provedor,
        String cpf,
        String nome,
        LocalDate dataNascimento
) {
}
