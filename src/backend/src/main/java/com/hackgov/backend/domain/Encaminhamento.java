package com.hackgov.backend.domain;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class Encaminhamento {

    private static final int LIMITE_DE_REAGENDAMENTOS = 2;

    private Long id;
    private String protocolo;
    private LocalDate dataCriacao;
    private boolean urgente;
    private StatusEncaminhamento status;

    private Cidadao cidadao;
    private Especialidade especialidade;
    private UnidadeSaude unidadeOrigem;
    private UnidadeSaude unidadeDestino;

    private List<Agendamento> agendamentos;
    private List<HistoricoStatus> historico;

    public Encaminhamento(
            Long id,
            String protocolo,
            Cidadao cidadao,
            Especialidade especialidade,
            UnidadeSaude unidadeOrigem,
            UnidadeSaude unidadeDestino) {

        this(
                id,
                protocolo,
                cidadao,
                especialidade,
                unidadeOrigem,
                unidadeDestino,
                false
        );
    }

    public Encaminhamento(
            Long id,
            String protocolo,
            Cidadao cidadao,
            Especialidade especialidade,
            UnidadeSaude unidadeOrigem,
            UnidadeSaude unidadeDestino,
            boolean urgente) {

        if (protocolo == null || protocolo.isBlank()) {
            throw new IllegalArgumentException(
                    "O protocolo é obrigatório."
            );
        }

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

        if (unidadeOrigem == null) {
            throw new IllegalArgumentException(
                    "A unidade de origem é obrigatória."
            );
        }

        if (unidadeDestino == null) {
            throw new IllegalArgumentException(
                    "A unidade de destino é obrigatória."
            );
        }

        this.id = id;
        this.protocolo = protocolo;
        this.cidadao = cidadao;
        this.especialidade = especialidade;
        this.unidadeOrigem = unidadeOrigem;
        this.unidadeDestino = unidadeDestino;
        this.urgente = urgente;
        this.dataCriacao = LocalDate.now();

        this.status =
                StatusEncaminhamento.RECEBIDO_TRIADO;

        this.agendamentos = new ArrayList<>();
        this.historico = new ArrayList<>();

        historico.add(
                new HistoricoStatus(
                        1L,
                        null,
                        StatusEncaminhamento.RECEBIDO_TRIADO,
                        null
                )
        );
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

        return horariosLivres();
    }

    public List<HorarioDisponivel> reabrirLista() {

        if (status != StatusEncaminhamento.AGENDADO) {
            throw new IllegalStateException(
                    "Não há horário marcado para reagendar."
            );
        }

        return horariosLivres();
    }

    public Agendamento agendamentoAtivo() {

        for (Agendamento agendamento : agendamentos) {

            if (agendamento.getStatus() == StatusAgendamento.AGENDADO) {
                return agendamento;
            }
        }

        throw new IllegalStateException(
                "Este encaminhamento não possui agendamento ativo."
        );
    }

    public AcaoPendente acaoPendente() {

        if (!agendamentos.isEmpty()) {

            Agendamento ultimo = agendamentos.get(
                    agendamentos.size() - 1
            );

            if (ultimo.getStatus() == StatusAgendamento.FALTA) {
                return AcaoPendente.REAGENDAR;
            }
        }

        if (status != StatusEncaminhamento.AGUARDANDO_AGENDAMENTO) {
            return null;
        }

        for (Agendamento agendamento : agendamentos) {

            if (agendamento.getStatus() == StatusAgendamento.AGENDADO) {
                return null;
            }
        }

        return AcaoPendente.COBRAR_MARCACAO;
    }

    public Optional<Duration> esperaParaAgendar() {

        LocalDateTime entrada = null;
        LocalDateTime saida = null;

        for (HistoricoStatus registro : historico) {

            if (registro.getStatusNovo()
                    == StatusEncaminhamento.AGUARDANDO_AGENDAMENTO) {
                entrada = registro.getDataHora();
                saida = null;
            } else if (entrada != null
                    && saida == null
                    && registro.getStatusAnterior()
                    == StatusEncaminhamento.AGUARDANDO_AGENDAMENTO) {
                saida = registro.getDataHora();
            }
        }

        if (entrada == null) {
            return Optional.empty();
        }

        LocalDateTime fim = saida == null
                ? LocalDateTime.now()
                : saida;

        return Optional.of(Duration.between(entrada, fim));
    }

    private List<HorarioDisponivel> horariosLivres() {

        List<HorarioDisponivel> livres = new ArrayList<>();

        for (HorarioDisponivel horario :
                especialidade.consultarHorariosDisponiveis()) {

            if (unidadeDestino.equals(horario.getUnidade())) {
                livres.add(horario);
            }
        }

        return List.copyOf(livres);
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
        exigirPrazoDeAlteracao(agendamento);

        encerrarAgendamento(agendamento);

        atualizarStatus(
                StatusEncaminhamento.AGUARDANDO_AGENDAMENTO,
                null
        );
    }

    public Agendamento reagendar(
            Agendamento agendamento,
            HorarioDisponivel novoHorario) {

        exigirAgendamentoAtivo(agendamento);
        exigirPrazoDeAlteracao(agendamento);
        exigirLimiteDeReagendamento();
        validarHorarioLivre(novoHorario);

        if (agendamento.getHorario() == novoHorario) {
            throw new IllegalArgumentException(
                    "O agendamento já está neste horário."
            );
        }

        encerrarAgendamento(agendamento);

        Agendamento novo = new Agendamento(
                (long) agendamentos.size() + 1,
                novoHorario.getDataHora()
        );

        novo.definirOrigem(agendamento);
        novoHorario.ocupar(novo);
        novo.definirHorario(novoHorario);
        agendamentos.add(novo);

        return novo;
    }

    private void encerrarAgendamento(Agendamento agendamento) {

        HorarioDisponivel horario = agendamento.getHorario();

        if (horario == null) {
            throw new IllegalStateException(
                    "O agendamento não está vinculado a um horário."
            );
        }

        agendamento.cancelar();
        horario.liberar(agendamento);
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

    private void exigirPrazoDeAlteracao(Agendamento agendamento) {

        LocalDateTime limite = agendamento
                .getDataHora()
                .minusHours(24);

        if (LocalDateTime.now().isAfter(limite)) {
            throw new IllegalStateException(
                    "Só é possível cancelar ou reagendar até 24 horas antes do horário marcado."
            );
        }
    }

    private void exigirLimiteDeReagendamento() {

        int reagendamentos = 0;

        for (Agendamento existente : agendamentos) {

            if (existente.getAgendamentoOrigem() != null) {
                reagendamentos++;
            }
        }

        if (reagendamentos >= LIMITE_DE_REAGENDAMENTOS) {
            throw new IllegalStateException(
                    "O próximo reagendamento só pode ser feito no balcão da UBS."
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

        if (!unidadeDestino.equals(horario.getUnidade())) {
            throw new IllegalArgumentException(
                    "O horário não pertence à unidade de destino do encaminhamento."
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

    public String getProtocolo() {
        return protocolo;
    }

    public LocalDate getDataCriacao() {
        return dataCriacao;
    }

    public boolean isUrgente() {
        return urgente;
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

    public UnidadeSaude getUnidadeOrigem() {
        return unidadeOrigem;
    }

    public UnidadeSaude getUnidadeDestino() {
        return unidadeDestino;
    }

    public List<Agendamento> getAgendamentos() {
        return List.copyOf(agendamentos);
    }

    public List<HistoricoStatus> getHistorico() {
        return List.copyOf(historico);
    }
}
