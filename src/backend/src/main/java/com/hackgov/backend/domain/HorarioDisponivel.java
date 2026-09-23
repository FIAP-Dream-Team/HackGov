package com.hackgov.backend.domain;

import java.time.LocalDateTime;

public class HorarioDisponivel {

    private Long id;
    private Especialidade especialidade;
    private LocalDateTime dataHora;
    private Agendamento agendamento;

    public HorarioDisponivel(
            Long id,
            Especialidade especialidade,
            LocalDateTime dataHora) {

        if (especialidade == null) {
            throw new IllegalArgumentException(
                    "A especialidade é obrigatória."
            );
        }

        if (dataHora == null) {
            throw new IllegalArgumentException(
                    "A data e o horário são obrigatórios."
            );
        }

        if (dataHora.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException(
                    "Não é possível publicar um horário no passado."
            );
        }

        this.id = id;
        this.especialidade = especialidade;
        this.dataHora = dataHora;
    }

    public boolean estaLivre() {
        return agendamento == null;
    }

    public void ocupar(Agendamento agendamento) {

        if (agendamento == null) {
            throw new IllegalArgumentException(
                    "O agendamento é obrigatório."
            );
        }

        if (!estaLivre()) {
            throw new IllegalStateException(
                    "O horário não está mais disponível."
            );
        }

        this.agendamento = agendamento;
    }

    public void liberar(Agendamento agendamento) {

        if (this.agendamento != agendamento) {
            throw new IllegalStateException(
                    "O horário não está ocupado por este agendamento."
            );
        }

        this.agendamento = null;
    }

    public Long getId() {
        return id;
    }

    public Especialidade getEspecialidade() {
        return especialidade;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public Agendamento getAgendamento() {
        return agendamento;
    }
}
