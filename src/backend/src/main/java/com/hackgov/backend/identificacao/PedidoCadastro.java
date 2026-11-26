package com.hackgov.backend.identificacao;

import java.time.LocalDate;

public record PedidoCadastro(
        String nome,
        String cpf,
        LocalDate dataNascimento,
        String cartaoSus,
        String senha
) {
}
