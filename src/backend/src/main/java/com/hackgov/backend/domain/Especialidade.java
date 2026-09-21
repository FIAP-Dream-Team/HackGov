package com.hackgov.backend.domain;

public class Especialidade {

    private Long id;
    private String nome;

    public Especialidade(Long id, String nome) {

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException(
                    "O nome da especialidade é obrigatório."
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