package com.hackgov.backend.domain;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class Encaminhamento {

    private Long id;
    private LocalDate dataCriacao;
    private StatusEncaminhamento status;

    private Cidadao cidadao;
    private Especialidade especialidade;

    private List<Agendamento> agendamentos;
    private List<HistoricoStatus> historico;

    public Encaminhamento(
            Long id,
            Cidadao cidadao,
            Especialidade especialidade) {

        if (cidadao == null) {
            throw new IllegalArgumentException(
                    "O cidadão é obrigatório."
            );
        }

        if (especialidade == null) {
            throw new IllegalArgumentException(
                    "A especialidade é obrigatória."
            );
        }

        this.id = id;
        this.cidadao = cidadao;
        this.especialidade = especialidade;
        this.dataCriacao = LocalDate.now();

        this.status =
                StatusEncaminhamento.RECEBIDO_TRIADO;

        this.agendamentos = new ArrayList<>();
        this.historico = new ArrayList<>();
    }

    public boolean podeAgendar() {

        return status ==
                StatusEncaminhamento.AGUARDANDO_AGENDAMENTO;
    }

    public void atualizarStatus(
            StatusEncaminhamento novoStatus,
            UsuarioInstitucional responsavel) {

        if (novoStatus == null) {
            throw new IllegalArgumentException(
                    "O novo status é obrigatório."
            );
        }

        StatusEncaminhamento statusAnterior =
                this.status;

        this.status = novoStatus;

        HistoricoStatus registro =
                new HistoricoStatus(
                        (long) historico.size() + 1,
                        statusAnterior,
                        novoStatus,
                        responsavel
                );

        historico.add(registro);
    }

    public void adicionarAgendamento(
            Agendamento agendamento) {

        if (!podeAgendar()) {
            throw new IllegalStateException(
                    "Este encaminhamento não está disponível para agendamento."
            );
        }

        if (agendamento == null) {
            throw new IllegalArgumentException(
                    "O agendamento é obrigatório."
            );
        }

        agendamentos.add(agendamento);

        atualizarStatus(
                StatusEncaminhamento.AGENDADO,
                null
        );
    }

    public Long getId() {
        return id;
    }

    public LocalDate getDataCriacao() {
        return dataCriacao;
    }

    public StatusEncaminhamento getStatus() {
        return status;
    }

    public Cidadao getCidadao() {
        return cidadao;
    }

    public Especialidade getEspecialidade() {
        return especialidade;
    }

    public List<Agendamento> getAgendamentos() {
        return agendamentos;
    }

    public List<HistoricoStatus> getHistorico() {
        return historico;
    }
}