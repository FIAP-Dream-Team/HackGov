package com.hackgov.backend.demo;

import com.hackgov.backend.domain.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class DemoModelagem {

    public static void main(String[] args) {

        DateTimeFormatter formato =
                DateTimeFormatter.ofPattern("dd/MM/yyyy 'às' HH:mm");

        System.out.println("==========================");
        System.out.println("     SISTEMA MINHA VEZ");
        System.out.println("==========================");

        Cidadao cidadao = new Cidadao(
                1L,
                "João Silva",
                "12345678900",
                "898000000000000",
                LocalDate.of(2005, 5, 10)
        );

        Especialidade cardiologia =
                new Especialidade(
                        1L,
                        "Cardiologia"
                );

        UnidadeSaude ubsCentro = new UnidadeSaude(
                1L,
                "UBS Centro",
                TipoUnidade.UBS,
                null,
                "Rua das Flores",
                "100",
                null,
                "Centro",
                "São Paulo",
                "SP",
                "01001000"
        );

        UnidadeSaude ambulatorio = new UnidadeSaude(
                2L,
                "Ambulatório de Especialidades",
                TipoUnidade.ESPECIALIZADA,
                "1234567",
                "Avenida Brasil",
                "500",
                "Bloco B",
                "Centro",
                "São Paulo",
                "SP",
                "01002000"
        );

        UnidadeSaude outroAmbulatorio = new UnidadeSaude(
                3L,
                "Ambulatório Leste",
                TipoUnidade.ESPECIALIZADA,
                null,
                "Rua do Leste",
                "20",
                null,
                "Tatuapé",
                "São Paulo",
                "SP",
                "03001000"
        );

        UsuarioInstitucional atendente =
                new UsuarioInstitucional(
                        1L,
                        "Maria Souza",
                        "maria.ubs",
                        PerfilUsuario.ATENDENTE,
                        ubsCentro
                );

        HorarioDisponivel horarioQuatorze = new HorarioDisponivel(
                1L,
                cardiologia,
                ambulatorio,
                LocalDateTime.now()
                        .plusDays(7)
                        .withHour(14)
                        .withMinute(0)
                        .withSecond(0)
                        .withNano(0)
        );

        HorarioDisponivel horarioNove = new HorarioDisponivel(
                2L,
                cardiologia,
                ambulatorio,
                LocalDateTime.now()
                        .plusDays(8)
                        .withHour(9)
                        .withMinute(0)
                        .withSecond(0)
                        .withNano(0)
        );

        HorarioDisponivel horarioOutraUnidade = new HorarioDisponivel(
                3L,
                cardiologia,
                outroAmbulatorio,
                LocalDateTime.now()
                        .plusDays(7)
                        .withHour(14)
                        .withMinute(0)
                        .withSecond(0)
                        .withNano(0)
        );

        cardiologia.publicarHorario(horarioQuatorze);
        cardiologia.publicarHorario(horarioNove);
        cardiologia.publicarHorario(horarioOutraUnidade);

        System.out.println();

        atendente.autenticar();

        Encaminhamento encaminhamento =
                new Encaminhamento(
                        1L,
                        "MV-2026-0001",
                        cidadao,
                        cardiologia,
                        ubsCentro,
                        ambulatorio
                );

        System.out.println();

        System.out.println(
                "Cidadão: " + cidadao.getNome()
        );

        System.out.println(
                "Especialidade: "
                        + cardiologia.getNome()
        );

        System.out.println(
                "Protocolo: "
                        + encaminhamento.getProtocolo()
        );

        System.out.println(
                "Urgente: "
                        + encaminhamento.isUrgente()
        );

        System.out.println(
                "Status inicial: "
                        + encaminhamento.getStatus()
        );

        atendente.atualizarEncaminhamento(
                encaminhamento,
                StatusEncaminhamento.AGUARDANDO_AGENDAMENTO
        );

        System.out.println();

        System.out.println(
                "Status após análise da UBS: "
                        + encaminhamento.getStatus()
        );

        List<HorarioDisponivel> livres =
                encaminhamento.solicitarAgendamento();

        System.out.println();
        System.out.println(
                "Horários livres na unidade de destino: "
                        + livres.size()
        );

        for (HorarioDisponivel horario : livres) {
            System.out.println(
                    "- "
                            + horario.getDataHora().format(formato)
                            + " ("
                            + horario.getUnidade().getNome()
                            + ")"
            );
        }

        System.out.println(
                "Vaga de outra unidade visível: "
                        + livres.contains(horarioOutraUnidade)
        );

        Agendamento agendamento = encaminhamento.selecionarHorario(
                horarioQuatorze
        );

        System.out.println();
        System.out.println("Agendamento realizado com sucesso!");
        System.out.println(
                "Data/Hora: "
                        + agendamento.getDataHora().format(formato)
        );
        System.out.println(
                "Status do agendamento: "
                        + agendamento.getStatus()
        );
        System.out.println(
                "Status do encaminhamento: "
                        + encaminhamento.getStatus()
        );
        System.out.println(
                "Horários livres depois da escolha: "
                        + vagasLivresNaUnidade(cardiologia, ambulatorio)
        );

        Agendamento reagendado = encaminhamento.reagendar(
                agendamento,
                horarioNove
        );

        System.out.println();
        System.out.println(
                "Reagendado para: "
                        + reagendado.getDataHora().format(formato)
        );
        System.out.println(
                "Agendamentos no encaminhamento: "
                        + encaminhamento.getAgendamentos().size()
        );
        System.out.println(
                "Anterior ficou: "
                        + agendamento.getStatus()
        );
        System.out.println(
                "Novo aponta para o cancelado: "
                        + (reagendado.getAgendamentoOrigem() == agendamento)
        );
        System.out.println(
                "Horário das 14h liberado: "
                        + horarioQuatorze.estaLivre()
        );
        System.out.println(
                "Horário das 9h ocupado: "
                        + !horarioNove.estaLivre()
        );

        encaminhamento.cancelarAgendamento(reagendado);

        System.out.println();
        System.out.println(
                "Agendamento cancelado: "
                        + reagendado.getStatus()
        );
        System.out.println(
                "Horário cancelado ainda registrado: "
                        + (reagendado.getHorario() == horarioNove)
        );
        System.out.println(
                "Data de cancelamento preenchida: "
                        + (reagendado.getDataCancelamento() != null)
        );
        System.out.println(
                "Encaminhamento voltou para: "
                        + encaminhamento.getStatus()
        );
        System.out.println(
                "Horários livres depois do cancelamento: "
                        + vagasLivresNaUnidade(cardiologia, ambulatorio)
        );

        System.out.println();
        System.out.println("==========================");
        System.out.println("   HISTÓRICO DE STATUS");
        System.out.println("==========================");

        for (HistoricoStatus registro :
                encaminhamento.getHistorico()) {

            registro.registrarAlteracao();

            System.out.println(
                    "--------------------------"
            );
        }

        System.out.println();
        System.out.println("==========================");
        System.out.println("   TESTE DE VALIDAÇÃO");
        System.out.println("==========================");

        Encaminhamento aindaTriado =
                new Encaminhamento(
                        2L,
                        "MV-2026-0002",
                        cidadao,
                        cardiologia,
                        ubsCentro,
                        ambulatorio
                );

        try {
            aindaTriado.solicitarAgendamento();
        } catch (IllegalStateException erro) {
            System.out.println(
                    "Erro esperado: " + erro.getMessage()
            );
        }

        try {
            encaminhamento.selecionarHorario(horarioOutraUnidade);
        } catch (IllegalArgumentException erro) {
            System.out.println(
                    "Erro esperado: " + erro.getMessage()
            );
        }

        Agendamento novaMarcacao = encaminhamento.selecionarHorario(
                horarioNove
        );

        System.out.println(
                "Nova marcação no horário liberado: "
                        + novaMarcacao.getDataHora().format(formato)
        );

        try {
            encaminhamento.selecionarHorario(horarioNove);
        } catch (IllegalStateException erro) {
            System.out.println(
                    "Erro esperado: " + erro.getMessage()
            );
        }

        try {
            atendente.atualizarEncaminhamento(
                    aindaTriado,
                    StatusEncaminhamento.CONCLUIDO
            );
        } catch (IllegalStateException erro) {
            System.out.println(
                    "Erro esperado: " + erro.getMessage()
            );
        }

        System.out.println();
        System.out.println("==========================");
        System.out.println("     FIM DA EXECUÇÃO");
        System.out.println("==========================");
    }

    private static long vagasLivresNaUnidade(
            Especialidade especialidade,
            UnidadeSaude unidade) {

        return especialidade.consultarHorariosDisponiveis()
                .stream()
                .filter(horario -> unidade.equals(horario.getUnidade()))
                .count();
    }
}
