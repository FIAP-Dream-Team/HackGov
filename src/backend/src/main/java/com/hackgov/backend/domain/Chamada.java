package com.hackgov.backend.domain;

import java.time.LocalDateTime;

public class Chamada {

    private static final int TAMANHO_SENHA = 10;
    private static final int TAMANHO_SALA = 20;

    private final Long id;
    private final Agendamento agendamento;
    private final String senha;
    private final String sala;
    private final LocalDateTime dataHora;
    private final UsuarioInstitucional responsavel;

    public Chamada(
            Long id,
            Agendamento agendamento,
            String senha,
            String sala,
            UsuarioInstitucional responsavel) {

        if (agendamento == null) {
            throw new IllegalArgumentException(
                    "O agendamento é obrigatório."
            );
        }

        if (agendamento.getStatus() != StatusAgendamento.AGENDADO) {
            throw new IllegalStateException(
                    "Só é possível chamar um agendamento ativo."
            );
        }

        if (responsavel == null) {
            throw new IllegalArgumentException(
                    "A chamada precisa ser feita pela equipe."
            );
        }

        this.id = id;
        this.agendamento = agendamento;
        this.senha = exigir(
                senha,
                TAMANHO_SENHA,
                "A senha da chamada é obrigatória.",
                "A senha da chamada pode ter no máximo 10 caracteres."
        );
        this.sala = exigir(
                sala,
                TAMANHO_SALA,
                "A sala é obrigatória.",
                "A sala pode ter no máximo 20 caracteres."
        );
        this.responsavel = responsavel;
        this.dataHora = LocalDateTime.now();
    }

    private static String exigir(String valor, int limite, String ausente, String longa) {

        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException(ausente);
        }

        String texto = valor.trim();

        if (texto.length() > limite) {
            throw new IllegalArgumentException(longa);
        }

        return texto;
    }

    public Long getId() {
        return id;
    }

    public Agendamento getAgendamento() {
        return agendamento;
    }

    public String getSenha() {
        return senha;
    }

    public String getSala() {
        return sala;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public UsuarioInstitucional getResponsavel() {
        return responsavel;
    }
}
