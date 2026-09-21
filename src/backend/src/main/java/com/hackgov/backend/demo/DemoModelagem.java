package com.hackgov.backend.demo;

import com.hackgov.backend.domain.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

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

        UsuarioInstitucional atendente =
                new UsuarioInstitucional(
                        1L,
                        "Maria Souza",
                        "maria.ubs",
                        PerfilUsuario.ATENDENTE
                );

        System.out.println();

        atendente.autenticar();

        Encaminhamento encaminhamento =
                new Encaminhamento(
                        1L,
                        cidadao,
                        cardiologia
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

        if (encaminhamento.podeAgendar()) {

            System.out.println();

            System.out.println(
                    "Encaminhamento disponível para agendamento."
            );

            Agendamento agendamento =
                    new Agendamento(
                            1L,
                            LocalDateTime.now()
                                    .plusDays(7)
                                    .withHour(14)
                                    .withMinute(0)
                                    .withSecond(0)
                                    .withNano(0)
                    );

            encaminhamento.adicionarAgendamento(
                    agendamento
            );

            System.out.println();

            System.out.println(
                    "Agendamento realizado com sucesso!"
            );

            System.out.println(
                    "Data/Hora: "
                            + agendamento
                            .getDataHora()
                            .format(formato)
            );

            System.out.println(
                    "Status do agendamento: "
                            + agendamento.getStatus()
            );

            System.out.println(
                    "Status do encaminhamento: "
                            + encaminhamento.getStatus()
            );
        }

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

        try {

            Encaminhamento encaminhamentoInvalido =
                    new Encaminhamento(
                            2L,
                            cidadao,
                            cardiologia
                    );

            Agendamento agendamentoInvalido =
                    new Agendamento(
                            2L,
                            LocalDateTime.now()
                                    .plusDays(5)
                                    .withHour(10)
                                    .withMinute(0)
                                    .withSecond(0)
                                    .withNano(0)
                    );

            encaminhamentoInvalido.adicionarAgendamento(
                    agendamentoInvalido
            );

        } catch (IllegalStateException erro) {

            System.out.println(
                    "Erro esperado: "
                            + erro.getMessage()
            );
        }

        System.out.println();

        System.out.println("==========================");
        System.out.println("     FIM DA EXECUÇÃO");
        System.out.println("==========================");
    }
}