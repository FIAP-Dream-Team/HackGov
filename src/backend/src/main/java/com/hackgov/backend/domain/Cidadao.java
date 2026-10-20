package com.hackgov.backend.domain;

import java.time.LocalDate;

public class Cidadao extends Pessoa {

    private String cpf;
    private String cartaoSus;
    private LocalDate dataNascimento;

    public Cidadao(
            Long id,
            String nome,
            String cpf,
            String cartaoSus,
            LocalDate dataNascimento) {

        super(id, nome);

        if (cpf == null || cpf.isBlank()) {
            throw new IllegalArgumentException(
                    "O CPF é obrigatório."
            );
        }

        if (dataNascimento == null) {
            throw new IllegalArgumentException(
                    "A data de nascimento é obrigatória."
            );
        }

        if (dataNascimento.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "A data de nascimento não pode ser no futuro."
            );
        }

        this.cpf = cpf;
        this.cartaoSus = cartaoSus;
        this.dataNascimento = dataNascimento;
    }

    public String getCpf() {
        return cpf;
    }

    public String getCartaoSus() {
        return cartaoSus;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }
}