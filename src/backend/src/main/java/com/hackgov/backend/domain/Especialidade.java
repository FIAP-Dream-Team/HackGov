package com.hackgov.backend.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Especialidade {

    private Long id;
    private String nome;
    private final List<HorarioDisponivel> horarios = new ArrayList<>();

    public Especialidade(Long id, String nome) {

        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException(
                    "O nome da especialidade é obrigatório."
            );
        }

        this.id = id;
        this.nome = nome;
    }

    public void publicarHorario(HorarioDisponivel horario) {

        if (horario == null) {
            throw new IllegalArgumentException(
                    "O horário é obrigatório."
            );
        }

        if (!equals(horario.getEspecialidade())) {
            throw new IllegalArgumentException(
                    "O horário não pertence a esta especialidade."
            );
        }

        for (HorarioDisponivel existente : horarios) {

            if (existente.getDataHora().equals(horario.getDataHora())) {
                throw new IllegalArgumentException(
                        "Já existe horário nessa data para a especialidade."
                );
            }
        }

        horarios.add(horario);
    }

    public List<HorarioDisponivel> consultarHorariosDisponiveis() {

        List<HorarioDisponivel> livres = new ArrayList<>();

        for (HorarioDisponivel horario : horarios) {

            if (horarioLivre(horario)) {
                livres.add(horario);
            }
        }

        return List.copyOf(livres);
    }

    public boolean verificarDisponibilidade(HorarioDisponivel horario) {

        return horario != null
                && horarios.contains(horario)
                && horarioLivre(horario);
    }

    private boolean horarioLivre(HorarioDisponivel horario) {

        return horario.estaLivre()
                && !horario.getDataHora().isBefore(LocalDateTime.now());
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    @Override
    public boolean equals(Object outro) {

        if (this == outro) {
            return true;
        }

        if (!(outro instanceof Especialidade)) {
            return false;
        }

        Especialidade especialidade = (Especialidade) outro;

        return id != null && id.equals(especialidade.id);
    }

    @Override
    public int hashCode() {
        return id == null ? 0 : id.hashCode();
    }
}
