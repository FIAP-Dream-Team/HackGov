package com.hackgov.backend.domain;

import java.time.LocalDateTime;

public class Agendamento {

    private Long id;
    private LocalDateTime dataHora;
    private LocalDateTime dataCancelamento;
    private StatusAgendamento status;
    private HorarioDisponivel horario;
    private Agendamento agendamentoOrigem;

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
        this.dataCancelamento = LocalDateTime.now();
    }

    public void registrarFalta() {

        if (status != StatusAgendamento.AGENDADO) {
            throw new IllegalStateException(
                    "Só é possível registrar falta de um agendamento ativo."
            );
        }

        this.status = StatusAgendamento.FALTA;
    }

    void definirHorario(HorarioDisponivel horario) {
        this.horario = horario;
    }

    void definirOrigem(Agendamento origem) {

        if (origem == null) {
            throw new IllegalArgumentException(
                    "O agendamento de origem é obrigatório."
            );
        }

        if (origem == this) {
            throw new IllegalArgumentException(
                    "O agendamento não pode ser origem de si mesmo."
            );
        }

        if (this.agendamentoOrigem != null) {
            throw new IllegalStateException(
                    "O agendamento já aponta para uma origem."
            );
        }

        this.agendamentoOrigem = origem;
    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public LocalDateTime getDataCancelamento() {
        return dataCancelamento;
    }

    public StatusAgendamento getStatus() {
        return status;
    }

    public HorarioDisponivel getHorario() {
        return horario;
    }

    public Agendamento getAgendamentoOrigem() {
        return agendamentoOrigem;
    }
}
