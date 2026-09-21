package com.hackgov.backend.domain;

import java.time.LocalDateTime;

public class Agendamento {

    private Long id;
    private LocalDateTime dataHora;
    private StatusAgendamento status;

    public Agendamento(
            Long id,
            LocalDateTime dataHora) {

        if (dataHora == null) {
            throw new IllegalArgumentException(
                    "A data e o horário são obrigatórios."
            );
        }

        if (dataHora.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException(
                    "Não é possível agendar para uma data passada."
            );
        }

        this.id = id;
        this.dataHora = dataHora;
        this.status = StatusAgendamento.AGENDADO;
    }

    public void confirmar() {
        this.status = StatusAgendamento.AGENDADO;
    }

    public void cancelar() {
        this.status = StatusAgendamento.CANCELADO;
    }

    public void reagendar(LocalDateTime novaDataHora) {

        if (novaDataHora == null) {
            throw new IllegalArgumentException(
                    "O novo horário é obrigatório."
            );
        }

        if (novaDataHora.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException(
                    "Não é possível reagendar para uma data passada."
            );
        }

        this.dataHora = novaDataHora;
        this.status = StatusAgendamento.AGENDADO;
    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public StatusAgendamento getStatus() {
        return status;
    }
}