package com.hackgov.backend.identificacao;

import com.hackgov.backend.domain.Encaminhamento;
import com.hackgov.backend.domain.Especialidade;
import com.hackgov.backend.domain.HorarioDisponivel;
import com.hackgov.backend.domain.PerfilUsuario;
import com.hackgov.backend.domain.TipoUnidade;
import com.hackgov.backend.domain.UnidadeSaude;
import com.hackgov.backend.equipe.ServicoDeEquipe;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AcompanhamentoHttpTest {

    private static final String NOME_CIDADAO = "NOMESECRETO Andrade";
    private static final String NOME_EQUIPE = "NOMEEQUIPE Secreto";

    @Autowired
    private MockMvc mvc;

    @Autowired
    private AcervoMinhaVez acervo;

    @Autowired
    private ServicoDeEquipe equipe;

    private UnidadeSaude origem;
    private Especialidade especialidade;

    @BeforeEach
    void limpar() throws Exception {
        acervo.limpar();
        origem = unidade("UBS Centro", TipoUnidade.UBS);
        especialidade = new Especialidade(acervo.proximoId(), "Cardiologia");
    }

    @Test
    void semEncaminhamentoNaoImitaPedidoEmAndamento() throws Exception {
        String token = tokenDoApp();

        MvcResult resultado = mvc.perform(get("/api/acompanhamento")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.temEncaminhamento").value(false))
                .andExpect(jsonPath("$.situacao").value("SEM_ENCAMINHAMENTO"))
                .andExpect(jsonPath("$.mensagem").value("Você não tem encaminhamento em andamento."))
                .andExpect(jsonPath("$.encaminhamentos").isEmpty())
                .andReturn();

        String corpo = corpo(resultado);
        assertFalse(corpo.contains("RECEBIDO_TRIADO"));
        assertFalse(corpo.contains("trilha"));
        assertFalse(corpo.contains("NOMESECRETO"));
    }

    @Test
    void trilhaInicialEIgualNoTotemENoAplicativo() throws Exception {
        String tokenApp = tokenDoApp();
        encaminhamento("MV-2026-0099");
        String tokenTotem = tokenDoTotem();

        MvcResult app = acompanhar(tokenApp);
        MvcResult totem = acompanhar(tokenTotem);

        assertEquals(corpo(app), corpo(totem));
        assertFalse(corpo(app).contains("NOMESECRETO"));
        assertFalse(corpo(app).contains("NOMEEQUIPE"));

        mvc.perform(get("/api/acompanhamento")
                        .header("Authorization", "Bearer " + tokenApp))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.situacao").value("COM_ENCAMINHAMENTO"))
                .andExpect(jsonPath("$.encaminhamentos[0].protocolo").value("MV-2026-0099"))
                .andExpect(jsonPath("$.encaminhamentos[0].rotulo").value("Recebido e triado"))
                .andExpect(jsonPath("$.encaminhamentos[0].podeAgendar").value(false))
                .andExpect(jsonPath("$.encaminhamentos[0].proximoPasso")
                        .value("Aguarde a liberação dos horários."))
                .andExpect(jsonPath("$.encaminhamentos[0].trilha[0].situacao").value("ATUAL"))
                .andExpect(jsonPath("$.encaminhamentos[0].trilha[1].status").value("AGUARDANDO_AGENDAMENTO"))
                .andExpect(jsonPath("$.encaminhamentos[0].trilha[1].situacao").value("PENDENTE"))
                .andExpect(jsonPath("$.encaminhamentos[0].trilha[3].status").value("CONCLUIDO"))
                .andExpect(jsonPath("$.encaminhamentos[0].horarioMarcado").doesNotExist());
    }

    @Test
    void mudancaDaEquipeApareceIgualParaOCidadao() throws Exception {
        String tokenApp = tokenDoApp();
        encaminhamento("MV-2026-0099");
        String tokenTotem = tokenDoTotem();
        String tokenEquipe = tokenDaEquipe();

        mvc.perform(post("/api/equipe/encaminhamentos/MV-2026-0099/status")
                        .header("Authorization", "Bearer " + tokenEquipe)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"status":"AGUARDANDO_AGENDAMENTO"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("AGUARDANDO_AGENDAMENTO"))
                .andExpect(jsonPath("$.rotulo").value("Aguardando agendamento"));

        MvcResult app = acompanhar(tokenApp);
        MvcResult totem = acompanhar(tokenTotem);
        assertEquals(corpo(app), corpo(totem));
        assertFalse(corpo(app).contains("NOMEEQUIPE"));

        mvc.perform(get("/api/acompanhamento")
                        .header("Authorization", "Bearer " + tokenApp))
                .andExpect(jsonPath("$.encaminhamentos[0].status").value("AGUARDANDO_AGENDAMENTO"))
                .andExpect(jsonPath("$.encaminhamentos[0].trilha[0].situacao").value("CONCLUIDA"))
                .andExpect(jsonPath("$.encaminhamentos[0].trilha[1].situacao").value("ATUAL"))
                .andExpect(jsonPath("$.encaminhamentos[0].podeAgendar").value(true))
                .andExpect(jsonPath("$.encaminhamentos[0].proximoPasso")
                        .value("Já é possível escolher um horário no aplicativo."));
    }

    @Test
    void cidadaoNaoMudaEtapaETransicaoInvalidaNaoAlteraOQueEleVe() throws Exception {
        String tokenApp = tokenDoApp();
        encaminhamento("MV-2026-0099");
        String tokenEquipe = tokenDaEquipe();

        mvc.perform(post("/api/equipe/encaminhamentos/MV-2026-0099/status")
                        .header("Authorization", "Bearer " + tokenApp)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"status":"AGUARDANDO_AGENDAMENTO"}
                                """))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.codigo").value("ACESSO_NEGADO"));

        mvc.perform(post("/api/equipe/encaminhamentos/MV-2026-0099/status")
                        .header("Authorization", "Bearer " + tokenEquipe)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"status":"CONCLUIDO"}
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.codigo").value("REGRA_VIOLADA"));

        mvc.perform(get("/api/acompanhamento")
                        .header("Authorization", "Bearer " + tokenApp))
                .andExpect(jsonPath("$.encaminhamentos[0].status").value("RECEBIDO_TRIADO"));
    }

    @Test
    void horarioMarcadoMostraDataEQueAAlteracaoENoAplicativo() throws Exception {
        String tokenApp = tokenDoApp();
        Encaminhamento encaminhamento = encaminhamento("MV-2026-0099");
        String tokenEquipe = tokenDaEquipe();

        mvc.perform(post("/api/equipe/encaminhamentos/MV-2026-0099/status")
                        .header("Authorization", "Bearer " + tokenEquipe)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"status":"AGUARDANDO_AGENDAMENTO"}
                                """))
                .andExpect(status().isOk());

        HorarioDisponivel horario = new HorarioDisponivel(
                acervo.proximoId(),
                especialidade,
                encaminhamento.getUnidadeDestino(),
                LocalDateTime.now().plusDays(7).withHour(14).withMinute(0).withSecond(0).withNano(0)
        );
        especialidade.publicarHorario(horario);
        encaminhamento.selecionarHorario(horario);

        mvc.perform(get("/api/acompanhamento")
                        .header("Authorization", "Bearer " + tokenApp))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.encaminhamentos[0].status").value("AGENDADO"))
                .andExpect(jsonPath("$.encaminhamentos[0].rotulo").value("Agendado"))
                .andExpect(jsonPath("$.encaminhamentos[0].podeAgendar").value(false))
                .andExpect(jsonPath("$.encaminhamentos[0].podeAlterarHorario").value(true))
                .andExpect(jsonPath("$.encaminhamentos[0].horarioMarcado.dataHora").isNotEmpty())
                .andExpect(jsonPath("$.encaminhamentos[0].proximoPasso")
                        .value("O horário está marcado. Para reagendar ou cancelar, use o aplicativo."))
                .andExpect(jsonPath("$.encaminhamentos[0].trilha[2].situacao").value("ATUAL"));
    }

    private String tokenDoApp() throws Exception {
        MvcResult cadastro = mvc.perform(post("/api/app/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome":"%s",
                                  "cpf":"39053344705",
                                  "dataNascimento":"1992-07-03",
                                  "cartaoSus":"700000000000005",
                                  "senha":"minhavez"
                                }
                                """.formatted(NOME_CIDADAO)))
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
        equipe.registrar(
                NOME_EQUIPE,
                "atendente.centro",
                "minhavez",
                PerfilUsuario.ATENDENTE,
                origem
        );

        MvcResult login = mvc.perform(post("/api/equipe/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"login":"atendente.centro","senha":"minhavez"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.canal").value("EQUIPE"))
                .andExpect(jsonPath("$.nome").doesNotExist())
                .andReturn();
        return token(login);
    }

    private Encaminhamento encaminhamento(String protocolo) {
        Encaminhamento encaminhamento = new Encaminhamento(
                acervo.proximoId(),
                protocolo,
                acervo.buscarPorCpf("39053344705").orElseThrow(),
                especialidade,
                origem,
                unidade("Ambulatório Central", TipoUnidade.ESPECIALIZADA)
        );
        acervo.adicionarEncaminhamento(encaminhamento);
        return encaminhamento;
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

    private MvcResult acompanhar(String token) throws Exception {
        return mvc.perform(get("/api/acompanhamento")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn();
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
