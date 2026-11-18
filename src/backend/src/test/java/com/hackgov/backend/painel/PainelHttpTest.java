package com.hackgov.backend.painel;

import com.hackgov.backend.domain.Encaminhamento;
import com.hackgov.backend.domain.Especialidade;
import com.hackgov.backend.domain.HorarioDisponivel;
import com.hackgov.backend.domain.PerfilUsuario;
import com.hackgov.backend.domain.StatusAgendamento;
import com.hackgov.backend.domain.TipoUnidade;
import com.hackgov.backend.domain.UnidadeSaude;
import com.hackgov.backend.equipe.ServicoDeEquipe;
import com.hackgov.backend.memoria.AcervoMinhaVez;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
class PainelHttpTest {

    private static final String NOME = "NOMESECRETO Andrade";
    private static final String CPF = "39053344705";
    private static final String PROTOCOLO = "MV-2026-0099";

    @Autowired
    private MockMvc mvc;

    @Autowired
    private AcervoMinhaVez acervo;

    @Autowired
    private ServicoDeEquipe equipe;

    @LocalServerPort
    private int porta;

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
    void semChamadaNaoInventaSenhaNemReaproveitaOutroAtendimento() throws Exception {
        String token = tokenDoApp();
        prepararAgendado(token);

        MvcResult painel = mvc.perform(get("/api/painel"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.temChamada").value(false))
                .andExpect(jsonPath("$.mensagem").value("Nenhuma senha chamada no momento."))
                .andExpect(jsonPath("$.senha").doesNotExist())
                .andExpect(jsonPath("$.sala").doesNotExist())
                .andExpect(jsonPath("$.cor").doesNotExist())
                .andReturn();

        assertAusente(corpo(painel));

        chamar(tokenDaEquipe(), "A12", "2");

        mvc.perform(post("/api/app/encaminhamentos/" + PROTOCOLO + "/cancelamento")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"confirmado":true}
                                """))
                .andExpect(status().isOk());

        MvcResult vazio = mvc.perform(get("/api/painel"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.temChamada").value(false))
                .andExpect(jsonPath("$.senha").doesNotExist())
                .andReturn();

        assertFalse(corpo(vazio).contains("A12"));
        assertEquals(StatusAgendamento.CANCELADO, acervo.chamadas().get(0).getAgendamento().getStatus());
    }

    @Test
    void painelMostraSoSenhaESalaEmAmarelo() throws Exception {
        String token = tokenDoApp();
        prepararAgendado(token);
        String tokenEquipe = tokenDaEquipe();

        MvcResult chamada = chamar(tokenEquipe, "A12", "2");

        assertAusente(corpo(chamada));
        mvc.perform(get("/api/painel"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.temChamada").value(true))
                .andExpect(jsonPath("$.senha").value("A12"))
                .andExpect(jsonPath("$.sala").value("2"))
                .andExpect(jsonPath("$.estado").value("CHAMADA"))
                .andExpect(jsonPath("$.cor").value("AMARELO"))
                .andExpect(jsonPath("$.mensagem").value("É a vez de alguém."));

        MvcResult painel = mvc.perform(get("/api/painel")).andReturn();
        assertAusente(corpo(painel));
        assertFalse(corpo(painel).contains("minhavez"));
    }

    @Test
    void novaChamadaSubstituiAAnteriorEOcupaOPainel() throws Exception {
        String token = tokenDoApp();
        prepararAgendado(token);
        String tokenEquipe = tokenDaEquipe();

        chamar(tokenEquipe, "A12", "2");
        chamar(tokenEquipe, "B07", "3");

        MvcResult painel = mvc.perform(get("/api/painel"))
                .andExpect(jsonPath("$.senha").value("B07"))
                .andExpect(jsonPath("$.sala").value("3"))
                .andExpect(jsonPath("$.cor").value("AMARELO"))
                .andReturn();

        assertFalse(corpo(painel).contains("A12"));
        assertEquals(2, acervo.chamadas().size());
        assertAusente(corpo(painel));
    }

    @Test
    void cidadaoNaoChamaESemAgendamentoNaoHaSenha() throws Exception {
        String token = tokenDoApp();
        encaminhamento();
        String tokenEquipe = tokenDaEquipe();
        liberar(tokenEquipe);

        mvc.perform(post("/api/equipe/encaminhamentos/" + PROTOCOLO + "/chamada")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"senha":"A12","sala":"2"}
                                """))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.codigo").value("ACESSO_NEGADO"));

        mvc.perform(post("/api/equipe/encaminhamentos/" + PROTOCOLO + "/chamada")
                        .header("Authorization", "Bearer " + tokenEquipe)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"senha":"A12","sala":"2"}
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.codigo").value("REGRA_VIOLADA"));

        mvc.perform(post("/api/equipe/encaminhamentos/" + PROTOCOLO + "/chamada")
                        .header("Authorization", "Bearer " + tokenEquipe)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.codigo").value("DADOS_INVALIDOS"));

        mvc.perform(get("/api/painel"))
                .andExpect(jsonPath("$.temChamada").value(false))
                .andExpect(jsonPath("$.senha").doesNotExist());
        assertTrue(acervo.chamadas().isEmpty());
    }

    @Test
    void mesmaConexaoRecebeAChamadaSemNovaRequisicao() throws Exception {
        String token = tokenDoApp();
        prepararAgendado(token);
        String tokenEquipe = tokenDaEquipe();

        HttpClient cliente = HttpClient.newHttpClient();
        HttpRequest pedido = HttpRequest.newBuilder(
                        URI.create("http://127.0.0.1:" + porta + "/api/painel/eventos"))
                .header("Accept", "text/event-stream")
                .build();
        HttpResponse<InputStream> resposta = cliente.send(pedido, HttpResponse.BodyHandlers.ofInputStream());
        assertEquals(200, resposta.statusCode());

        try (BufferedReader leitor = new BufferedReader(
                new InputStreamReader(resposta.body(), StandardCharsets.UTF_8))) {
            String abertura = evento(leitor);
            assertTrue(abertura.contains("\"temChamada\":false"));
            assertFalse(abertura.contains("A12"));

            chamar(tokenEquipe, "A12", "2");

            String atualizacao = evento(leitor);
            assertTrue(atualizacao.contains("\"senha\":\"A12\""));
            assertTrue(atualizacao.contains("\"sala\":\"2\""));
            assertTrue(atualizacao.contains("\"cor\":\"AMARELO\""));
            assertTrue(atualizacao.contains("É a vez de alguém."));
            assertFalse(atualizacao.contains(NOME));
            assertFalse(atualizacao.contains(PROTOCOLO));
        }
    }

    private MvcResult chamar(String tokenEquipe, String senha, String sala) throws Exception {
        return mvc.perform(post("/api/equipe/encaminhamentos/" + PROTOCOLO + "/chamada")
                        .header("Authorization", "Bearer " + tokenEquipe)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"senha":"%s","sala":"%s"}
                                """.formatted(senha, sala)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.senha").value(senha))
                .andExpect(jsonPath("$.sala").value(sala))
                .andExpect(jsonPath("$.estado").value("CHAMADA"))
                .andExpect(jsonPath("$.cor").value("AMARELO"))
                .andExpect(jsonPath("$.mensagem").value("É a vez de alguém."))
                .andReturn();
    }

    private void prepararAgendado(String token) throws Exception {
        encaminhamento();
        HorarioDisponivel horario = new HorarioDisponivel(
                acervo.proximoId(),
                especialidade,
                destino,
                LocalDateTime.now().plusDays(7).withHour(14).withMinute(0).withSecond(0).withNano(0)
        );
        especialidade.publicarHorario(horario);
        String tokenEquipe = tokenDaEquipe();
        liberar(tokenEquipe);

        mvc.perform(post("/api/app/encaminhamentos/" + PROTOCOLO + "/agendamento")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"horarioId":%d}
                                """.formatted(horario.getId())))
                .andExpect(status().isCreated());
    }

    private void liberar(String tokenEquipe) throws Exception {
        mvc.perform(post("/api/equipe/encaminhamentos/" + PROTOCOLO + "/status")
                        .header("Authorization", "Bearer " + tokenEquipe)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"status":"AGUARDANDO_AGENDAMENTO"}
                                """))
                .andExpect(status().isOk());
    }

    private String tokenDoApp() throws Exception {
        MvcResult cadastro = mvc.perform(post("/api/app/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome":"%s",
                                  "cpf":"%s",
                                  "dataNascimento":"1992-07-03",
                                  "cartaoSus":"700000000000005",
                                  "senha":"minhavez"
                                }
                                """.formatted(NOME, CPF)))
                .andExpect(status().isCreated())
                .andReturn();
        return token(cadastro);
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

    private void encaminhamento() {
        acervo.adicionarEncaminhamento(new Encaminhamento(
                acervo.proximoId(),
                PROTOCOLO,
                acervo.buscarPorCpf(CPF).orElseThrow(),
                especialidade,
                origem,
                destino
        ));
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

    private static void assertAusente(String corpo) {
        assertFalse(corpo.contains(NOME));
        assertFalse(corpo.contains("NOMEEQUIPE"));
        assertFalse(corpo.contains(PROTOCOLO));
        assertFalse(corpo.contains(CPF));
        assertFalse(corpo.contains("Cardiologia"));
    }

    private static String evento(BufferedReader leitor) throws Exception {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        try {
            return executor.submit(() -> {
                StringBuilder bloco = new StringBuilder();
                String linha;
                while ((linha = leitor.readLine()) != null) {
                    if (linha.isEmpty()) {
                        if (!bloco.isEmpty()) {
                            return bloco.toString();
                        }
                        continue;
                    }
                    bloco.append(linha).append('\n');
                }
                return bloco.toString();
            }).get(5, TimeUnit.SECONDS);
        } finally {
            executor.shutdownNow();
        }
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
