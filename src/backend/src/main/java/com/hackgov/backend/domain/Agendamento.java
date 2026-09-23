package com.hackgov.backend.domain;

import java.time.LocalDateTime;

public class Agendamento {

    private Long id;
    private LocalDateTime dataHora;
    private StatusAgendamento status;
    private HorarioDisponivel horario;

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

        if (status != StatusAgendamento.AGENDADO) {
            throw new IllegalStateException(
                    "Só é possível confirmar um agendamento ativo."
            );
        }
    }

    public void cancelar() {

        if (status != StatusAgendamento.AGENDADO) {
            throw new IllegalStateException(
                    "Só é possível cancelar um agendamento ativo."
            );
        }

        this.status = StatusAgendamento.CANCELADO;
    }

    public void reagendar(LocalDateTime novaDataHora) {

        if (status != StatusAgendamento.AGENDADO) {
            throw new IllegalStateException(
                    "Só é possível reagendar um agendamento ativo."
            );
        }

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
    }

    void definirHorario(HorarioDisponivel horario) {
        this.horario = horario;
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

    public HorarioDisponivel getHorario() {
        return horario;
    }
}