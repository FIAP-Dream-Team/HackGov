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

    public List<HorarioDisponivel> solicitarAgendamento() {

        if (!podeAgendar()) {
            throw new IllegalStateException(
                    "Este encaminhamento não está disponível para agendamento."
            );
        }

        return especialidade.consultarHorariosDisponiveis();
    }

    public Agendamento selecionarHorario(HorarioDisponivel horario) {

        if (horario == null) {
            throw new IllegalArgumentException(
                    "O horário é obrigatório."
            );
        }

        if (!especialidade.verificarDisponibilidade(horario)) {
            throw new IllegalStateException(
                    "O horário não está mais disponível."
            );
        }

        Agendamento agendamento = new Agendamento(
                (long) agendamentos.size() + 1,
                horario.getDataHora()
        );

        adicionarAgendamento(agendamento, horario);

        return agendamento;
    }

    public void atualizarStatus(
            StatusEncaminhamento novoStatus,
            UsuarioInstitucional responsavel) {

        if (novoStatus == null) {
            throw new IllegalArgumentException(
                    "O novo status é obrigatório."
            );
        }

        if (!transicaoPermitida(this.status, novoStatus)) {
            throw new IllegalStateException(
                    "Não é possível mudar o status de "
                            + this.status
                            + " para "
                            + novoStatus
                            + "."
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
            Agendamento agendamento,
            HorarioDisponivel horario) {

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

        validarHorarioLivre(horario);

        if (!agendamento.getDataHora().equals(horario.getDataHora())) {
            throw new IllegalArgumentException(
                    "A data do agendamento precisa ser a do horário escolhido."
            );
        }

        horario.ocupar(agendamento);
        agendamento.definirHorario(horario);
        agendamentos.add(agendamento);

        atualizarStatus(
                StatusEncaminhamento.AGENDADO,
                null
        );
    }

    public void cancelarAgendamento(Agendamento agendamento) {

        exigirAgendamentoAtivo(agendamento);

        HorarioDisponivel horario = agendamento.getHorario();

        agendamento.cancelar();

        if (horario != null) {
            horario.liberar(agendamento);
            agendamento.definirHorario(null);
        }

        atualizarStatus(
                StatusEncaminhamento.AGUARDANDO_AGENDAMENTO,
                null
        );
    }

    public void reagendar(
            Agendamento agendamento,
            HorarioDisponivel novoHorario) {

        exigirAgendamentoAtivo(agendamento);
        validarHorarioLivre(novoHorario);

        if (agendamento.getHorario() == novoHorario) {
            throw new IllegalArgumentException(
                    "O agendamento já está neste horário."
            );
        }

        HorarioDisponivel horarioAtual = agendamento.getHorario();

        if (horarioAtual == null) {
            throw new IllegalStateException(
                    "O agendamento não está vinculado a um horário."
            );
        }

        agendamento.reagendar(novoHorario.getDataHora());
        horarioAtual.liberar(agendamento);
        novoHorario.ocupar(agendamento);
        agendamento.definirHorario(novoHorario);
    }

    private void exigirAgendamentoAtivo(Agendamento agendamento) {

        if (status != StatusEncaminhamento.AGENDADO) {
            throw new IllegalStateException(
                    "Este encaminhamento não possui agendamento ativo."
            );
        }

        if (agendamento == null || !agendamentos.contains(agendamento)) {
            throw new IllegalArgumentException(
                    "O agendamento não pertence a este encaminhamento."
            );
        }

        if (agendamento.getStatus() != StatusAgendamento.AGENDADO) {
            throw new IllegalStateException(
                    "Só é possível alterar um agendamento ativo."
            );
        }
    }

    private void validarHorarioLivre(HorarioDisponivel horario) {

        if (horario == null) {
            throw new IllegalArgumentException(
                    "O horário é obrigatório."
            );
        }

        if (!especialidade.equals(horario.getEspecialidade())) {
            throw new IllegalArgumentException(
                    "O horário não pertence à especialidade do encaminhamento."
            );
        }

        if (!especialidade.verificarDisponibilidade(horario)) {
            throw new IllegalStateException(
                    "O horário não está mais disponível."
            );
        }
    }

    private boolean transicaoPermitida(
            StatusEncaminhamento atual,
            StatusEncaminhamento proximo) {

        if (atual == StatusEncaminhamento.RECEBIDO_TRIADO
                && proximo == StatusEncaminhamento.AGUARDANDO_AGENDAMENTO) {
            return true;
        }

        if (atual == StatusEncaminhamento.AGUARDANDO_AGENDAMENTO
                && proximo == StatusEncaminhamento.AGENDADO) {
            return true;
        }

        if (atual == StatusEncaminhamento.AGENDADO
                && proximo == StatusEncaminhamento.CONCLUIDO) {
            return true;
        }

        if (atual == StatusEncaminhamento.AGENDADO
                && proximo == StatusEncaminhamento.AGUARDANDO_AGENDAMENTO) {
            return true;
        }

        return false;
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
        return List.copyOf(agendamentos);
    }

    public List<HistoricoStatus> getHistorico() {
        return List.copyOf(historico);
    }
}