package com.hackgov.backend.agendamento;

import com.hackgov.backend.config.DadosSinteticos;
import com.hackgov.backend.domain.Agendamento;
import com.hackgov.backend.domain.Encaminhamento;
import com.hackgov.backend.domain.Especialidade;
import com.hackgov.backend.domain.HorarioDisponivel;
import com.hackgov.backend.domain.PerfilUsuario;
import com.hackgov.backend.domain.StatusAgendamento;
import com.hackgov.backend.domain.StatusEncaminhamento;
import com.hackgov.backend.domain.TipoUnidade;
import com.hackgov.backend.domain.UnidadeSaude;
import com.hackgov.backend.equipe.ServicoDeEquipe;
import com.hackgov.backend.identificacao.ServicoDeIdentificacao;
import com.hackgov.backend.memoria.AcervoMinhaVez;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AgendamentoHttpTest {

    private static final String NOME_CIDADAO = "NOMESECRETO Andrade";
    private static final String CPF = "39053344705";
    private static final String CPF_OUTRO = "11144477735";
    private static final String PROTOCOLO = "MV-2026-0099";
    private static final String PROTOCOLO_OUTRO = "MV-2026-0100";
    private static final DateTimeFormatter DATA_LEITURA = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    @Autowired
    private MockMvc mvc;

    @Autowired
    private AcervoMinhaVez acervo;

    @Autowired
    private ServicoDeEquipe equipe;

    @Autowired
    private ServicoDeIdentificacao identificacao;

    private UnidadeSaude origem;
    private UnidadeSaude destino;
    private Especialidade especialidade;

    @BeforeEach
    void limpar() {
        acervo.limpar();
        origem = unidade("UBS Centro", TipoUnidade.UBS);
        destino = unidade("Ambulatório Central", TipoUnidade.ESPECIALIZADA);
        especialidade = new Especialidade(acervo.proximoId(), "Cardiologia");
    }

    @Test
    void semHorarioDeclaraAusenciaENaoInventaVaga() throws Exception {
        String token = tokenDoApp(NOME_CIDADAO, CPF, "700000000000005");
        encaminhamento(CPF, PROTOCOLO);
        String tokenEquipe = tokenDaEquipe();
        liberar(PROTOCOLO, tokenEquipe);

        Especialidade outra = new Especialidade(acervo.proximoId(), "Dermatologia");
        UnidadeSaude outraUnidade = unidade("Ambulatório Leste", TipoUnidade.ESPECIALIZADA);
        outra.publicarHorario(horario(outra, outraUnidade, daquiDias(4, 8)));
        especialidade.publicarHorario(horario(especialidade, outraUnidade, daquiDias(4, 8)));

        MvcResult lista = mvc.perform(get(horarios(PROTOCOLO))
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.temHorario").value(false))
                .andExpect(jsonPath("$.protocolo").value(PROTOCOLO))
                .andExpect(jsonPath("$.especialidade").value("Cardiologia"))
                .andExpect(jsonPath("$.unidade").value("Ambulatório Central"))
                .andExpect(jsonPath("$.mensagem").value(
                        "Não há horário livre para esta especialidade nesta unidade. Volte ao acompanhamento."
                ))
                .andExpect(jsonPath("$.horarios").isEmpty())
                .andReturn();

        String corpo = corpo(lista);
        assertFalse(corpo.contains("Dermatologia"));
        assertFalse(corpo.contains("Leste"));
        assertFalse(corpo.contains("08:00"));
        assertFalse(corpo.contains(NOME_CIDADAO));

        mvc.perform(post(agendamento(PROTOCOLO))
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"data":"2026-12-01","hora":"09:00"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.codigo").value("DADOS_INVALIDOS"));

        assertEquals(
                StatusEncaminhamento.AGUARDANDO_AGENDAMENTO,
                salvo(PROTOCOLO).getStatus()
        );
        assertTrue(salvo(PROTOCOLO).getAgendamentos().isEmpty());
    }

    @Test
    void listaSoHorarioLivreDaEspecialidadeEDaUnidade() throws Exception {
        String token = tokenDoApp(NOME_CIDADAO, CPF, "700000000000005");
        encaminhamento(CPF, PROTOCOLO);
        HorarioDisponivel livre = publicar(destino, daquiDias(7, 14));
        HorarioDisponivel outraUnidade = publicar(
                unidade("Ambulatório Leste", TipoUnidade.ESPECIALIZADA),
                daquiDias(8, 9)
        );
        String tokenEquipe = tokenDaEquipe();

        mvc.perform(get(horarios(PROTOCOLO))
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.codigo").value("REGRA_VIOLADA"));

        liberar(PROTOCOLO, tokenEquipe);

        mvc.perform(get(horarios(PROTOCOLO))
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.temHorario").value(true))
                .andExpect(jsonPath("$.horarios.length()").value(1))
                .andExpect(jsonPath("$.horarios[0].id").value(livre.getId().intValue()))
                .andExpect(jsonPath("$.horarios[0].data").value(livre.getDataHora().toLocalDate().toString()))
                .andExpect(jsonPath("$.horarios[0].hora").value("14:00"))
                .andExpect(jsonPath("$.horarios[0].especialidade").value("Cardiologia"))
                .andExpect(jsonPath("$.horarios[0].unidade").value("Ambulatório Central"))
                .andExpect(jsonPath("$.mensagem").doesNotExist());

        mvc.perform(post(agendamento(PROTOCOLO))
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"horarioId":%d,"unidadeId":999}
                                """.formatted(outraUnidade.getId())))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.codigo").value("DADOS_INVALIDOS"))
                .andExpect(jsonPath("$.mensagem").value(
                        "O horário não pertence à unidade de destino do encaminhamento."
                ));

        assertEquals(StatusEncaminhamento.AGUARDANDO_AGENDAMENTO, salvo(PROTOCOLO).getStatus());
        assertTrue(outraUnidade.estaLivre());
    }

    @Test
    void confirmarRepeteOsDadosETiraOHorarioDaListaDosOutros() throws Exception {
        String token = tokenDoApp(NOME_CIDADAO, CPF, "700000000000005");
        String tokenOutro = tokenDoApp("OUTRO Cidadao", CPF_OUTRO, null);
        encaminhamento(CPF, PROTOCOLO);
        encaminhamento(CPF_OUTRO, PROTOCOLO_OUTRO);
        HorarioDisponivel escolhido = publicar(destino, daquiDias(7, 14));
        HorarioDisponivel restante = publicar(destino, daquiDias(8, 9));
        String tokenEquipe = tokenDaEquipe();
        liberar(PROTOCOLO, tokenEquipe);
        liberar(PROTOCOLO_OUTRO, tokenEquipe);

        String data = escolhido.getDataHora().toLocalDate().toString();
        String leitura = DATA_LEITURA.format(escolhido.getDataHora());

        MvcResult confirmacao = mvc.perform(post(agendamento(PROTOCOLO))
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"horarioId":%d}
                                """.formatted(escolhido.getId())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.protocolo").value(PROTOCOLO))
                .andExpect(jsonPath("$.especialidade").value("Cardiologia"))
                .andExpect(jsonPath("$.data").value(data))
                .andExpect(jsonPath("$.hora").value("14:00"))
                .andExpect(jsonPath("$.unidade").value("Ambulatório Central"))
                .andExpect(jsonPath("$.status").value("AGENDADO"))
                .andExpect(jsonPath("$.agendamentoAnteriorId").doesNotExist())
                .andExpect(jsonPath("$.mensagem").value(
                        "Horário confirmado: Cardiologia, %s às 14:00, protocolo %s, Ambulatório Central."
                                .formatted(leitura, PROTOCOLO)
                ))
                .andReturn();

        assertFalse(corpo(confirmacao).contains(NOME_CIDADAO));
        assertFalse(escolhido.estaLivre());
        assertEquals(StatusEncaminhamento.AGENDADO, salvo(PROTOCOLO).getStatus());

        mvc.perform(get("/api/acompanhamento")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.encaminhamentos[0].status").value("AGENDADO"))
                .andExpect(jsonPath("$.encaminhamentos[0].horarioMarcado.dataHora").isNotEmpty())
                .andExpect(jsonPath("$.encaminhamentos[0].podeAgendar").value(false));

        mvc.perform(get(horarios(PROTOCOLO_OUTRO))
                        .header("Authorization", "Bearer " + tokenOutro))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.temHorario").value(true))
                .andExpect(jsonPath("$.horarios.length()").value(1))
                .andExpect(jsonPath("$.horarios[0].id").value(restante.getId().intValue()));

        mvc.perform(post(agendamento(PROTOCOLO_OUTRO))
                        .header("Authorization", "Bearer " + tokenOutro)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"horarioId":%d}
                                """.formatted(escolhido.getId())))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.codigo").value("REGRA_VIOLADA"));

        assertEquals(StatusEncaminhamento.AGUARDANDO_AGENDAMENTO, salvo(PROTOCOLO_OUTRO).getStatus());
        assertTrue(restante.estaLivre());
    }

    @Test
    void horarioOcupadoNaoViraOutraVaga() throws Exception {
        String token = tokenDoApp(NOME_CIDADAO, CPF, "700000000000005");
        String tokenOutro = tokenDoApp("OUTRO Cidadao", CPF_OUTRO, null);
        encaminhamento(CPF, PROTOCOLO);
        encaminhamento(CPF_OUTRO, PROTOCOLO_OUTRO);
        HorarioDisponivel unico = publicar(destino, daquiDias(7, 14));
        String tokenEquipe = tokenDaEquipe();
        liberar(PROTOCOLO, tokenEquipe);
        liberar(PROTOCOLO_OUTRO, tokenEquipe);

        mvc.perform(post(agendamento(PROTOCOLO))
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"horarioId":%d}
                                """.formatted(unico.getId())))
                .andExpect(status().isCreated());

        MvcResult doDono = mvc.perform(get(horarios(PROTOCOLO))
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.temHorario").value(false))
                .andExpect(jsonPath("$.horarios").isEmpty())
                .andExpect(jsonPath("$.mensagem").value(
                        "Não há outro horário livre para reagendar. Volte ao acompanhamento. "
                                + "O horário atual continua marcado."
                ))
                .andReturn();

        MvcResult doOutro = mvc.perform(get(horarios(PROTOCOLO_OUTRO))
                        .header("Authorization", "Bearer " + tokenOutro))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.temHorario").value(false))
                .andExpect(jsonPath("$.horarios").isEmpty())
                .andExpect(jsonPath("$.mensagem").value(
                        "Não há horário livre para esta especialidade nesta unidade. Volte ao acompanhamento."
                ))
                .andReturn();

        assertFalse(corpo(doDono).contains("14:00"));
        assertFalse(corpo(doOutro).contains("14:00"));
        assertEquals(StatusEncaminhamento.AGENDADO, salvo(PROTOCOLO).getStatus());
    }

    @Test
    void cancelarSemConfirmacaoMantemOHorario() throws Exception {
        String token = tokenDoApp(NOME_CIDADAO, CPF, "700000000000005");
        HorarioDisponivel horario = prepararAgendado(token, daquiDias(7, 14));

        mvc.perform(post(cancelamento(PROTOCOLO))
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.codigo").value("CONFIRMACAO_AUSENTE"));

        mvc.perform(post(cancelamento(PROTOCOLO))
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"confirmado":false}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.codigo").value("CONFIRMACAO_AUSENTE"));

        assertEquals(StatusEncaminhamento.AGENDADO, salvo(PROTOCOLO).getStatus());
        assertEquals(StatusAgendamento.AGENDADO, salvo(PROTOCOLO).agendamentoAtivo().getStatus());
        assertFalse(horario.estaLivre());

        mvc.perform(get(horarios(PROTOCOLO))
                        .header("Authorization", "Bearer " + token))
                .andExpect(jsonPath("$.temHorario").value(false))
                .andExpect(jsonPath("$.horarios").isEmpty());
    }

    @Test
    void cancelarDevolveOHorarioEVoltaParaAguardando() throws Exception {
        String token = tokenDoApp(NOME_CIDADAO, CPF, "700000000000005");
        String tokenOutro = tokenDoApp("OUTRO Cidadao", CPF_OUTRO, null);
        encaminhamento(CPF_OUTRO, PROTOCOLO_OUTRO);
        HorarioDisponivel horario = prepararAgendado(token, daquiDias(7, 14));
        liberar(PROTOCOLO_OUTRO, tokenDaEquipe());

        mvc.perform(post(cancelamento(PROTOCOLO))
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"confirmado":true}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.protocolo").value(PROTOCOLO))
                .andExpect(jsonPath("$.status").value("AGUARDANDO_AGENDAMENTO"))
                .andExpect(jsonPath("$.mensagem").value(
                        "Horário cancelado. O encaminhamento voltou para aguardando agendamento."
                ));

        assertTrue(horario.estaLivre());
        assertEquals(StatusAgendamento.CANCELADO, salvo(PROTOCOLO).getAgendamentos().get(0).getStatus());

        mvc.perform(get("/api/acompanhamento")
                        .header("Authorization", "Bearer " + token))
                .andExpect(jsonPath("$.encaminhamentos[0].status").value("AGUARDANDO_AGENDAMENTO"))
                .andExpect(jsonPath("$.encaminhamentos[0].podeAgendar").value(true))
                .andExpect(jsonPath("$.encaminhamentos[0].horarioMarcado").doesNotExist());

        mvc.perform(get(horarios(PROTOCOLO_OUTRO))
                        .header("Authorization", "Bearer " + tokenOutro))
                .andExpect(jsonPath("$.temHorario").value(true))
                .andExpect(jsonPath("$.horarios[0].id").value(horario.getId().intValue()));
    }

    @Test
    void reagendarReabreAListaEApontaParaOAnterior() throws Exception {
        String token = tokenDoApp(NOME_CIDADAO, CPF, "700000000000005");
        HorarioDisponivel primeiro = prepararAgendado(token, daquiDias(7, 14));
        HorarioDisponivel segundo = publicar(destino, daquiDias(8, 9));
        HorarioDisponivel terceiro = publicar(destino, daquiDias(9, 10));
        HorarioDisponivel quarto = publicar(destino, daquiDias(10, 11));
        Agendamento ativo = salvo(PROTOCOLO).agendamentoAtivo();

        mvc.perform(get(horarios(PROTOCOLO))
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.temHorario").value(true))
                .andExpect(jsonPath("$.horarios.length()").value(3))
                .andExpect(jsonPath("$.mensagem").value(
                        "Escolha outro horário livre. O horário atual continua marcado até a confirmação do reagendamento."
                ));

        String leitura = DATA_LEITURA.format(segundo.getDataHora());

        mvc.perform(post(reagendamento(PROTOCOLO))
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"horarioId":%d}
                                """.formatted(segundo.getId())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.protocolo").value(PROTOCOLO))
                .andExpect(jsonPath("$.especialidade").value("Cardiologia"))
                .andExpect(jsonPath("$.data").value(segundo.getDataHora().toLocalDate().toString()))
                .andExpect(jsonPath("$.hora").value("09:00"))
                .andExpect(jsonPath("$.unidade").value("Ambulatório Central"))
                .andExpect(jsonPath("$.status").value("AGENDADO"))
                .andExpect(jsonPath("$.agendamentoAnteriorId").value(ativo.getId().intValue()))
                .andExpect(jsonPath("$.mensagem").value(
                        "Horário reagendado: Cardiologia, %s às 09:00, protocolo %s, Ambulatório Central."
                                .formatted(leitura, PROTOCOLO)
                ));

        Agendamento novo = salvo(PROTOCOLO).agendamentoAtivo();
        assertEquals(2, salvo(PROTOCOLO).getAgendamentos().size());
        assertSame(ativo, novo.getAgendamentoOrigem());
        assertEquals(StatusAgendamento.CANCELADO, ativo.getStatus());
        assertTrue(primeiro.estaLivre());
        assertFalse(segundo.estaLivre());
        assertEquals(StatusEncaminhamento.AGENDADO, salvo(PROTOCOLO).getStatus());

        mvc.perform(get(horarios(PROTOCOLO))
                        .header("Authorization", "Bearer " + token))
                .andExpect(jsonPath("$.horarios[0].id").value(primeiro.getId().intValue()))
                .andExpect(jsonPath("$.horarios[1].id").value(terceiro.getId().intValue()))
                .andExpect(jsonPath("$.horarios[2].id").value(quarto.getId().intValue()));

        mvc.perform(post(reagendamento(PROTOCOLO))
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"horarioId":%d}
                                """.formatted(terceiro.getId())))
                .andExpect(status().isCreated());

        mvc.perform(post(reagendamento(PROTOCOLO))
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"horarioId":%d}
                                """.formatted(quarto.getId())))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.codigo").value("REGRA_VIOLADA"))
                .andExpect(jsonPath("$.mensagem").value(
                        "O próximo reagendamento só pode ser feito no balcão da UBS."
                ));

        assertEquals(3, salvo(PROTOCOLO).getAgendamentos().size());
        assertFalse(terceiro.estaLivre());
        assertTrue(quarto.estaLivre());
        assertEquals(terceiro.getDataHora(), salvo(PROTOCOLO).agendamentoAtivo().getDataHora());
    }

    @Test
    void prazoDe24HorasValeParaCancelarEReagendar() throws Exception {
        String token = tokenDoApp(NOME_CIDADAO, CPF, "700000000000005");
        HorarioDisponivel perto = prepararAgendado(token, daquiHoras(20));
        HorarioDisponivel longe = publicar(destino, daquiDias(9, 11));

        mvc.perform(post(cancelamento(PROTOCOLO))
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"confirmado":true}
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.codigo").value("REGRA_VIOLADA"))
                .andExpect(jsonPath("$.mensagem").value(
                        "Só é possível cancelar ou reagendar até 24 horas antes do horário marcado."
                ));

        mvc.perform(post(reagendamento(PROTOCOLO))
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"horarioId":%d}
                                """.formatted(longe.getId())))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.mensagem").value(
                        "Só é possível cancelar ou reagendar até 24 horas antes do horário marcado."
                ));

        assertEquals(StatusEncaminhamento.AGENDADO, salvo(PROTOCOLO).getStatus());
        assertFalse(perto.estaLivre());
        assertTrue(longe.estaLivre());
    }

    @Test
    void totemEEquipeNaoAgendam() throws Exception {
        String tokenApp = tokenDoApp(NOME_CIDADAO, CPF, "700000000000005");
        encaminhamento(CPF, PROTOCOLO);
        publicar(destino, daquiDias(7, 14));
        String tokenTotem = tokenDoTotem();
        String tokenEquipe = tokenDaEquipe();
        liberar(PROTOCOLO, tokenEquipe);

        negar(tokenTotem);
        negar(tokenEquipe);

        mvc.perform(get(horarios(PROTOCOLO)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.codigo").value("SESSAO_AUSENTE"));

        mvc.perform(get(horarios(PROTOCOLO))
                        .header("Authorization", "Bearer nao-existe"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.codigo").value("SESSAO_INVALIDA"));

        String tokenOutro = tokenDoApp("OUTRO Cidadao", CPF_OUTRO, null);
        mvc.perform(get(horarios(PROTOCOLO))
                        .header("Authorization", "Bearer " + tokenOutro))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.codigo").value("ENCAMINHAMENTO_NAO_ENCONTRADO"));

        mvc.perform(get(horarios(PROTOCOLO))
                        .header("Authorization", "Bearer " + tokenApp))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.temHorario").value(true));

        assertEquals(StatusEncaminhamento.AGUARDANDO_AGENDAMENTO, salvo(PROTOCOLO).getStatus());
    }

    @Test
    void dadoSinteticoPublicaHorariosLivresDoEncaminhamento() throws Exception {
        new DadosSinteticos(identificacao, equipe, acervo).run();

        MvcResult login = mvc.perform(post("/api/app/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"cpf":"52998224725","senha":"minhavez"}
                                """))
                .andExpect(status().isOk())
                .andReturn();
        String token = token(login);

        mvc.perform(get(horarios("MV-2026-0001"))
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.codigo").value("REGRA_VIOLADA"));

        MvcResult equipeLogin = mvc.perform(post("/api/equipe/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"login":"atendente.centro","senha":"minhavez"}
                                """))
                .andExpect(status().isOk())
                .andReturn();
        liberar("MV-2026-0001", token(equipeLogin));

        MvcResult lista = mvc.perform(get(horarios("MV-2026-0001"))
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.temHorario").value(true))
                .andExpect(jsonPath("$.especialidade").value("Cardiologia"))
                .andExpect(jsonPath("$.unidade").value("Ambulatório Central"))
                .andExpect(jsonPath("$.horarios.length()").value(3))
                .andExpect(jsonPath("$.horarios[0].hora").value("08:00"))
                .andExpect(jsonPath("$.horarios[1].hora").value("10:00"))
                .andExpect(jsonPath("$.horarios[2].hora").value("14:00"))
                .andExpect(jsonPath("$.horarios[0].especialidade").value("Cardiologia"))
                .andExpect(jsonPath("$.horarios[0].unidade").value("Ambulatório Central"))
                .andReturn();

        assertFalse(corpo(lista).contains("Maria"));
        assertEquals(StatusEncaminhamento.AGUARDANDO_AGENDAMENTO, salvo("MV-2026-0001").getStatus());
    }

    private void negar(String token) throws Exception {
        mvc.perform(get(horarios(PROTOCOLO))
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.codigo").value("ACESSO_NEGADO"));

        mvc.perform(post(agendamento(PROTOCOLO))
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"horarioId":1}
                                """))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.codigo").value("ACESSO_NEGADO"));

        mvc.perform(post(cancelamento(PROTOCOLO))
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"confirmado":true}
                                """))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.codigo").value("ACESSO_NEGADO"));

        mvc.perform(post(reagendamento(PROTOCOLO))
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"horarioId":1}
                                """))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.codigo").value("ACESSO_NEGADO"));
    }

    private HorarioDisponivel prepararAgendado(String token, LocalDateTime dataHora) throws Exception {
        encaminhamento(CPF, PROTOCOLO);
        HorarioDisponivel horario = publicar(destino, dataHora);
        String tokenEquipe = tokenDaEquipe();
        liberar(PROTOCOLO, tokenEquipe);

        mvc.perform(post(agendamento(PROTOCOLO))
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"horarioId":%d}
                                """.formatted(horario.getId())))
                .andExpect(status().isCreated());

        return horario;
    }

    private void liberar(String protocolo, String tokenEquipe) throws Exception {
        mvc.perform(post("/api/equipe/encaminhamentos/" + protocolo + "/status")
                        .header("Authorization", "Bearer " + tokenEquipe)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"status":"AGUARDANDO_AGENDAMENTO"}
                                """))
                .andExpect(status().isOk());
    }

    private String tokenDoApp(String nome, String cpf, String cartao) throws Exception {
        String cartaoJson = cartao == null ? "" : ",\n  \"cartaoSus\":\"" + cartao + "\"";
        MvcResult cadastro = mvc.perform(post("/api/app/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome":"%s",
                                  "cpf":"%s",
                                  "dataNascimento":"1992-07-03",
                                  "senha":"minhavez"%s
                                }
                                """.formatted(nome, cpf, cartaoJson)))
                .andExpect(status().isCreated())
                .andReturn();
        return token(cadastro);
    }

    private String tokenDoTotem() throws Exception {
        MvcResult entrada = mvc.perform(post("/api/totem/identificacao")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"cartaoSus":"700000000000005"}
                                """))
                .andExpect(status().isOk())
                .andReturn();
        return token(entrada);
    }

    private String tokenDaEquipe() throws Exception {
        if (acervo.buscarEquipePorLogin("atendente.centro").isEmpty()) {
            equipe.registrar(
                    "NOMEEQUIPE Secreto",
                    "atendente.centro",
                    "minhavez",
                    PerfilUsuario.ATENDENTE,
                    origem
            );
        }

        MvcResult login = mvc.perform(post("/api/equipe/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"login":"atendente.centro","senha":"minhavez"}
                                """))
                .andExpect(status().isOk())
                .andReturn();
        return token(login);
    }

    private Encaminhamento encaminhamento(String cpf, String protocolo) {
        Encaminhamento encaminhamento = new Encaminhamento(
                acervo.proximoId(),
                protocolo,
                acervo.buscarPorCpf(cpf).orElseThrow(),
                especialidade,
                origem,
                destino
        );
        acervo.adicionarEncaminhamento(encaminhamento);
        return encaminhamento;
    }

    private HorarioDisponivel publicar(UnidadeSaude unidade, LocalDateTime dataHora) {
        HorarioDisponivel horario = horario(especialidade, unidade, dataHora);
        especialidade.publicarHorario(horario);
        return horario;
    }

    private HorarioDisponivel horario(
            Especialidade daEspecialidade,
            UnidadeSaude unidade,
            LocalDateTime dataHora) {

        return new HorarioDisponivel(
                acervo.proximoId(),
                daEspecialidade,
                unidade,
                dataHora
        );
    }

    private UnidadeSaude unidade(String nome, TipoUnidade tipo) {
        return new UnidadeSaude(
                acervo.proximoId(),
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

    private Encaminhamento salvo(String protocolo) {
        return acervo.buscarEncaminhamentoPorProtocolo(protocolo).orElseThrow();
    }

    private static LocalDateTime daquiDias(int dias, int hora) {
        return LocalDateTime.now()
                .plusDays(dias)
                .withHour(hora)
                .withMinute(0)
                .withSecond(0)
                .withNano(0);
    }

    private static LocalDateTime daquiHoras(int horas) {
        return LocalDateTime.now()
                .plusHours(horas)
                .withMinute(0)
                .withSecond(0)
                .withNano(0);
    }

    private static String horarios(String protocolo) {
        return "/api/app/encaminhamentos/" + protocolo + "/horarios";
    }

    private static String agendamento(String protocolo) {
        return "/api/app/encaminhamentos/" + protocolo + "/agendamento";
    }

    private static String cancelamento(String protocolo) {
        return "/api/app/encaminhamentos/" + protocolo + "/cancelamento";
    }

    private static String reagendamento(String protocolo) {
        return "/api/app/encaminhamentos/" + protocolo + "/reagendamento";
    }

    private static String token(MvcResult resultado) throws Exception {
        String corpo = corpo(resultado);
        int inicio = corpo.indexOf("\"token\":\"") + "\"token\":\"".length();
        return corpo.substring(inicio, corpo.indexOf('"', inicio));
    }

    private static String corpo(MvcResult resultado) throws Exception {
        return resultado.getResponse().getContentAsString(StandardCharsets.UTF_8);
    }
}
