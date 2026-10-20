package com.hackgov.backend.domain;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RegrasDoEncaminhamentoTest {

    @Test
    void nascimentoNuloOuFuturoEhRecusado() {

        assertThrows(
                IllegalArgumentException.class,
                () -> cidadao(null)
        );

        assertThrows(
                IllegalArgumentException.class,
                () -> cidadao(LocalDate.now().plusDays(1))
        );
    }

    @Test
    void criacaoDoEncaminhamentoEntraNoHistorico() {

        Encaminhamento encaminhamento = encaminhamento();

        assertEquals(1, encaminhamento.getHistorico().size());

        HistoricoStatus criacao = encaminhamento.getHistorico().get(0);

        assertNull(criacao.getStatusAnterior());
        assertEquals(
                StatusEncaminhamento.RECEBIDO_TRIADO,
                criacao.getStatusNovo()
        );
        assertNull(criacao.getResponsavel());
    }

    @Test
    void reagendarCriaOutroAgendamentoEMantemOHorarioCancelado() {

        Cenario cenario = cenarioAgendado();

        Agendamento novo = cenario.encaminhamento.reagendar(
                cenario.ativo,
                cenario.segundo
        );

        assertEquals(2, cenario.encaminhamento.getAgendamentos().size());
        assertEquals(StatusAgendamento.CANCELADO, cenario.ativo.getStatus());
        assertSame(cenario.primeiro, cenario.ativo.getHorario());
        assertTrue(cenario.primeiro.estaLivre());
        assertSame(cenario.ativo, novo.getAgendamentoOrigem());
        assertEquals(
                StatusEncaminhamento.AGENDADO,
                cenario.encaminhamento.getStatus()
        );
    }

    @Test
    void terceiroReagendamentoFicaNoBalcao() {

        Cenario cenario = cenarioAgendado();
        HorarioDisponivel terceiro = horario(3L, cenario, 10);
        HorarioDisponivel quarto = horario(4L, cenario, 11);
        cenario.especialidade.publicarHorario(terceiro);
        cenario.especialidade.publicarHorario(quarto);

        Agendamento segundo = cenario.encaminhamento.reagendar(
                cenario.ativo,
                cenario.segundo
        );
        Agendamento terceiroAgendamento = cenario.encaminhamento.reagendar(
                segundo,
                terceiro
        );

        IllegalStateException erro = assertThrows(
                IllegalStateException.class,
                () -> cenario.encaminhamento.reagendar(
                        terceiroAgendamento,
                        quarto
                )
        );

        assertTrue(erro.getMessage().contains("balcão da UBS"));
    }

    @Test
    void cancelarComMenosDe24HorasEhRecusado() {

        Cenario cenario = cenarioAgendado(
                LocalDateTime.now().plusHours(2)
        );

        IllegalStateException erro = assertThrows(
                IllegalStateException.class,
                () -> cenario.encaminhamento.cancelarAgendamento(cenario.ativo)
        );

        assertTrue(erro.getMessage().contains("24 horas"));
        assertEquals(StatusAgendamento.AGENDADO, cenario.ativo.getStatus());
    }

    private static Cidadao cidadao(LocalDate nascimento) {

        return new Cidadao(
                1L,
                "João Silva",
                "12345678900",
                null,
                nascimento
        );
    }

    private static Encaminhamento encaminhamento() {

        return new Encaminhamento(
                1L,
                "MV-2026-0001",
                cidadao(LocalDate.of(2005, 5, 10)),
                new Especialidade(1L, "Cardiologia"),
                unidade(1L, "UBS Centro", TipoUnidade.UBS),
                unidade(2L, "Ambulatório", TipoUnidade.ESPECIALIZADA)
        );
    }

    private static UnidadeSaude unidade(Long id, String nome, TipoUnidade tipo) {

        return new UnidadeSaude(
                id,
                nome,
                tipo,
                null,
                "Rua das Flores",
                "100",
                null,
                "Centro",
                "São Paulo",
                "SP",
                "01001000"
        );
    }

    private static Cenario cenarioAgendado() {

        return cenarioAgendado(
                LocalDateTime.now()
                        .plusDays(7)
                        .withHour(14)
                        .withMinute(0)
                        .withSecond(0)
                        .withNano(0)
        );
    }

    private static Cenario cenarioAgendado(LocalDateTime primeiraData) {

        Especialidade especialidade = new Especialidade(1L, "Cardiologia");
        UnidadeSaude destino = unidade(2L, "Ambulatório", TipoUnidade.ESPECIALIZADA);

        Encaminhamento encaminhamento = new Encaminhamento(
                1L,
                "MV-2026-0001",
                cidadao(LocalDate.of(2005, 5, 10)),
                especialidade,
                unidade(1L, "UBS Centro", TipoUnidade.UBS),
                destino
        );

        encaminhamento.atualizarStatus(
                StatusEncaminhamento.AGUARDANDO_AGENDAMENTO,
                null
        );

        Cenario cenario = new Cenario();
        cenario.especialidade = especialidade;
        cenario.destino = destino;
        cenario.encaminhamento = encaminhamento;
        cenario.primeiro = new HorarioDisponivel(
                1L,
                especialidade,
                destino,
                primeiraData
        );
        cenario.segundo = horario(2L, cenario, 9);

        especialidade.publicarHorario(cenario.primeiro);
        especialidade.publicarHorario(cenario.segundo);
        cenario.ativo = encaminhamento.selecionarHorario(cenario.primeiro);

        return cenario;
    }

    private static HorarioDisponivel horario(Long id, Cenario cenario, int dia) {

        return new HorarioDisponivel(
                id,
                cenario.especialidade,
                cenario.destino,
                LocalDateTime.now()
                        .plusDays(dia)
                        .withHour(9)
                        .withMinute(0)
                        .withSecond(0)
                        .withNano(0)
        );
    }

    private static final class Cenario {
        private Especialidade especialidade;
        private UnidadeSaude destino;
        private Encaminhamento encaminhamento;
        private HorarioDisponivel primeiro;
        private HorarioDisponivel segundo;
        private Agendamento ativo;
    }
}
