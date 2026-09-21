package com.hackgov.backend.domain;

public abstract class Pessoa {

    private Long id;
    private String nome;

    public Pessoa(Long id, String nome) {

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException(
                    "O nome é obrigatório."
            );
        }

        this.id = id;
        this.nome = nome;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }
}