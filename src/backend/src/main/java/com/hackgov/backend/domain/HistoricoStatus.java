package com.hackgov.backend.domain;

import java.time.LocalDateTime;

public class HistoricoStatus {

    private Long id;
    private LocalDateTime dataHora;
    private StatusEncaminhamento statusAnterior;
    private StatusEncaminhamento statusNovo;
    private UsuarioInstitucional responsavel;

    public HistoricoStatus(
            Long id,
            StatusEncaminhamento statusAnterior,
            StatusEncaminhamento statusNovo,
            UsuarioInstitucional responsavel) {

        this.id = id;
        this.dataHora = LocalDateTime.now();
        this.statusAnterior = statusAnterior;
        this.statusNovo = statusNovo;
        this.responsavel = responsavel;
    }

    public void registrarAlteracao() {

        String anterior = statusAnterior == null
                ? "criação"
                : statusAnterior.toString();

        System.out.println(
                anterior + " -> " + statusNovo
        );

        if (responsavel != null) {

            System.out.println(
                    "Responsável: "
                            + responsavel.getNome()
            );

        } else {

            System.out.println(
                    "Alteração automática do sistema."
            );
        }

        System.out.println(
                "Data/Hora: " + dataHora
        );
    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public StatusEncaminhamento getStatusAnterior() {
        return statusAnterior;
    }

    public StatusEncaminhamento getStatusNovo() {
        return statusNovo;
    }

    public UsuarioInstitucional getResponsavel() {
        return responsavel;
    }
}