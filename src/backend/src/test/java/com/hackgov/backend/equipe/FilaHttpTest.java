package com.hackgov.backend.equipe;

import com.hackgov.backend.domain.Encaminhamento;
import com.hackgov.backend.domain.Especialidade;
import com.hackgov.backend.domain.HorarioDisponivel;
import com.hackgov.backend.domain.PerfilUsuario;
import com.hackgov.backend.domain.TipoUnidade;
import com.hackgov.backend.domain.UnidadeSaude;
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

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class FilaHttpTest {

    private static final String NOME = "NOMESECRETO Andrade";
    private static final String CPF = "39053344705";
    private static final String PROTOCOLO = "MV-2026-0099";
    private static final String PROTOCOLO_ORTOPEDIA = "MV-2026-0100";
    private static final String PROTOCOLO_OUTRA = "MV-2026-0200";

    @Autowired
    private MockMvc mvc;

    @Autowired
    private AcervoMinhaVez acervo;

    @Autowired
    private ServicoDeEquipe equipe;

    private UnidadeSaude origem;
    private UnidadeSaude destino;
    private Especialidade cardiologia;

    @BeforeEach
    void limpar() {
        acervo.limpar();
        origem = unidade("UBS Centro", TipoUnidade.UBS);
        destino = unidade("Ambulatório Central", TipoUnidade.ESPECIALIZADA);
        cardiologia = new Especialidade(acervo.proximoId(), "Cardiologia");
    }

    @Test
    void filaVaziaNaoViraErroEEspecialidadeSemEncaminhamentoFicaVazia() throws Exception {
        String gestor = tokenDoGestor();

        mvc.perform(get("/api/equipe/fila")
                        .header("Authorization", "Bearer " + gestor))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mensagem").value("Nenhum encaminhamento nesta unidade."))
                .andExpect(jsonPath("$.especialidades").isEmpty())
                .andExpect(jsonPath("$.mensagemEspera").value("Ainda não há espera medida."))
                .andExpect(jsonPath("$.mensagemFaltas")
                        .value("Ainda não há agendamento para calcular a taxa de faltas."))
                .andExpect(jsonPath("$.esperaMediaSegundos").doesNotExist())
                .andExpect(jsonPath("$.taxaFaltasPercentual").doesNotExist())
                .andExpect(jsonPath("$.codigo").doesNotExist());

        mvc.perform(get("/api/equipe/fila")
                        .header("Authorization", "Bearer " + gestor)
                        .param("especialidade", "Dermatologia"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.mensagem").doesNotExist())
                .andExpect(jsonPath("$.codigo").doesNotExist())
                .andExpect(jsonPath("$.especialidades.length()").value(1))
                .andExpect(jsonPath("$.especialidades[0].especialidade").value("Dermatologia"))
                .andExpect(jsonPath("$.especialidades[0].encaminhamentos").isEmpty());
    }

    @Test
    void segmentaPorEspecialidadeEMostraAAcaoPendenteSoNoCanalDaEquipe() throws Exception {
        String app = tokenDoApp();
        String tokenEquipe = tokenDaEquipe();
        Especialidade ortopedia = new Especialidade(acervo.proximoId(), "Ortopedia");
        UnidadeSaude outra = unidade("UBS Norte", TipoUnidade.UBS);
        encaminhamento(PROTOCOLO, cardiologia, origem);
        encaminhamento(PROTOCOLO_ORTOPEDIA, ortopedia, origem);
        encaminhamento(PROTOCOLO_OUTRA, cardiologia, outra);

        MvcResult fila = mvc.perform(get("/api/equipe/fila")
                        .header("Authorization", "Bearer " + tokenEquipe))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.especialidades.length()").value(2))
                .andExpect(jsonPath("$.especialidades[0].especialidade").value("Cardiologia"))
                .andExpect(jsonPath("$.especialidades[0].encaminhamentos.length()").value(1))
                .andExpect(jsonPath("$.especialidades[0].encaminhamentos[0].protocolo").value(PROTOCOLO))
                .andExpect(jsonPath("$.especialidades[0].encaminhamentos[0].nome").value(NOME))
                .andExpect(jsonPath("$.especialidades[0].encaminhamentos[0].status").value("RECEBIDO_TRIADO"))
                .andExpect(jsonPath("$.especialidades[0].encaminhamentos[0].acaoPendente").doesNotExist())
                .andExpect(jsonPath("$.especialidades[1].especialidade").value("Ortopedia"))
                .andExpect(jsonPath("$.especialidades[1].encaminhamentos[0].protocolo").value(PROTOCOLO_ORTOPEDIA))
                .andExpect(jsonPath("$.especialidades[1].encaminhamentos[0].acaoPendente").doesNotExist())
                .andExpect(jsonPath("$.mensagemEspera").value("Ainda não há espera medida."))
                .andReturn();

        String corpo = corpo(fila);
        assertFalse(corpo.contains(PROTOCOLO_OUTRA));
        assertFalse(corpo.contains(CPF));
        assertFalse(corpo.contains("Buscar resultado"));
        assertFalse(corpo.contains("minhavez"));

        String painel = corpo(mvc.perform(get("/api/painel")).andReturn());
        assertFalse(painel.contains(NOME));
        assertFalse(painel.contains(CPF));

        String acompanhamento = corpo(mvc.perform(get("/api/acompanhamento")
                        .header("Authorization", "Bearer " + app))
                .andReturn());
        assertFalse(acompanhamento.contains(NOME));
        assertFalse(acompanhamento.contains(CPF));

        liberar(tokenEquipe, PROTOCOLO);

        mvc.perform(get("/api/equipe/fila")
                        .header("Authorization", "Bearer " + tokenEquipe))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.especialidades[0].encaminhamentos[0].acaoPendente")
                        .value("COBRAR_MARCACAO"))
                .andExpect(jsonPath("$.especialidades[0].encaminhamentos[0].rotuloAcao")
                        .value("Cobrar marcação"))
                .andExpect(jsonPath("$.especialidades[1].encaminhamentos[0].acaoPendente").doesNotExist())
                .andExpect(jsonPath("$.esperaMediaSegundos", greaterThanOrEqualTo(0)))
                .andExpect(jsonPath("$.mensagemEspera").doesNotExist());
    }

    @Test
    void faltaViraReagendarECanceladoNaoEntraNaTaxa() throws Exception {
        String app = tokenDoApp();
        String tokenEquipe = tokenDaEquipe();
        encaminhamento(PROTOCOLO, cardiologia, origem);
        HorarioDisponivel primeiro = horario(8);
        HorarioDisponivel segundo = horario(10);
        liberar(tokenEquipe, PROTOCOLO);
        agendar(app, primeiro.getId());

        mvc.perform(get("/api/equipe/fila")
                        .header("Authorization", "Bearer " + tokenEquipe))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.especialidades[0].encaminhamentos[0].status").value("AGENDADO"))
                .andExpect(jsonPath("$.especialidades[0].encaminhamentos[0].acaoPendente").doesNotExist())
                .andExpect(jsonPath("$.faltas").value(0))
                .andExpect(jsonPath("$.agendamentos").value(1))
                .andExpect(jsonPath("$.taxaFaltasPercentual").value(0))
                .andExpect(jsonPath("$.esperaMediaSegundos", greaterThanOrEqualTo(0)));

        mvc.perform(post("/api/app/encaminhamentos/" + PROTOCOLO + "/cancelamento")
                        .header("Authorization", "Bearer " + app)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"confirmado":true}
                                """))
                .andExpect(status().isOk());

        mvc.perform(get("/api/equipe/fila")
                        .header("Authorization", "Bearer " + tokenEquipe))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.especialidades[0].encaminhamentos[0].acaoPendente")
                        .value("COBRAR_MARCACAO"))
                .andExpect(jsonPath("$.taxaFaltasPercentual").doesNotExist())
                .andExpect(jsonPath("$.mensagemFaltas")
                        .value("Ainda não há agendamento para calcular a taxa de faltas."));

        agendar(app, segundo.getId());

        mvc.perform(post("/api/equipe/encaminhamentos/" + PROTOCOLO + "/chamada")
                        .header("Authorization", "Bearer " + tokenEquipe)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"senha":"A12","sala":"2"}
                                """))
                .andExpect(status().isCreated());

        mvc.perform(post("/api/equipe/encaminhamentos/" + PROTOCOLO + "/falta")
                        .header("Authorization", "Bearer " + tokenEquipe))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.protocolo").value(PROTOCOLO))
                .andExpect(jsonPath("$.acaoPendente").value("REAGENDAR"))
                .andExpect(jsonPath("$.rotuloAcao").value("Reagendar"));

        mvc.perform(get("/api/painel"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.temChamada").value(false))
                .andExpect(jsonPath("$.senha").doesNotExist());

        MvcResult depois = mvc.perform(get("/api/equipe/fila")
                        .header("Authorization", "Bearer " + tokenEquipe))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.especialidades[0].encaminhamentos[0].acaoPendente").value("REAGENDAR"))
                .andExpect(jsonPath("$.faltas").value(1))
                .andExpect(jsonPath("$.agendamentos").value(1))
                .andExpect(jsonPath("$.taxaFaltasPercentual").value(100))
                .andReturn();
        assertFalse(corpo(depois).contains("Buscar resultado"));
        assertFalse(corpo(depois).contains(CPF));

        mvc.perform(post("/api/equipe/encaminhamentos/" + PROTOCOLO + "/falta")
                        .header("Authorization", "Bearer " + tokenEquipe))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.codigo").value("REGRA_VIOLADA"));
    }

    @Test
    void cidadaoEOutraUnidadeNaoAcessamAFila() throws Exception {
        String app = tokenDoApp();
        String tokenEquipe = tokenDaEquipe();
        encaminhamento(PROTOCOLO, cardiologia, origem);
        UnidadeSaude outra = unidade("UBS Norte", TipoUnidade.UBS);
        encaminhamento(PROTOCOLO_OUTRA, cardiologia, outra);

        mvc.perform(get("/api/equipe/fila")
                        .header("Authorization", "Bearer " + app))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.codigo").value("ACESSO_NEGADO"))
                .andExpect(jsonPath("$.mensagem").value("A fila da equipe é do canal institucional."));

        mvc.perform(post("/api/equipe/encaminhamentos/" + PROTOCOLO + "/falta")
                        .header("Authorization", "Bearer " + app))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.codigo").value("ACESSO_NEGADO"));

        mvc.perform(get("/api/equipe/fila"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.codigo").value("SESSAO_AUSENTE"));

        mvc.perform(post("/api/equipe/encaminhamentos/" + PROTOCOLO + "/falta"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.codigo").value("SESSAO_AUSENTE"));

        mvc.perform(post("/api/equipe/encaminhamentos/" + PROTOCOLO_OUTRA + "/falta")
                        .header("Authorization", "Bearer " + tokenEquipe))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.codigo").value("ACESSO_NEGADO"))
                .andExpect(jsonPath("$.mensagem").value("Este encaminhamento é de outra unidade."));

        mvc.perform(post("/api/equipe/encaminhamentos/MV-NAO-EXISTE/falta")
                        .header("Authorization", "Bearer " + tokenEquipe))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.codigo").value("ENCAMINHAMENTO_NAO_ENCONTRADO"));

        mvc.perform(post("/api/equipe/encaminhamentos/" + PROTOCOLO + "/falta")
                        .header("Authorization", "Bearer " + tokenEquipe))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.codigo").value("REGRA_VIOLADA"))
                .andExpect(jsonPath("$.mensagem")
                        .value("Este encaminhamento não possui agendamento ativo."));
    }

    private void agendar(String token, long horarioId) throws Exception {
        mvc.perform(post("/api/app/encaminhamentos/" + PROTOCOLO + "/agendamento")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"horarioId":%d}
                                """.formatted(horarioId)))
                .andExpect(status().isCreated());
    }

    private HorarioDisponivel horario(int hora) {
        HorarioDisponivel horario = new HorarioDisponivel(
                acervo.proximoId(),
                cardiologia,
                destino,
                LocalDateTime.now().plusDays(7).withHour(hora).withMinute(0).withSecond(0).withNano(0)
        );
        cardiologia.publicarHorario(horario);
        return horario;
    }

    private void liberar(String tokenEquipe, String protocolo) throws Exception {
        mvc.perform(post("/api/equipe/encaminhamentos/" + protocolo + "/status")
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

        return login("atendente.centro");
    }

    private String tokenDoGestor() throws Exception {
        if (acervo.buscarEquipePorLogin("gestor.centro").isEmpty()) {
            equipe.registrar(
                    "GESTOR Secreto",
                    "gestor.centro",
                    "minhavez",
                    PerfilUsuario.GESTOR,
                    origem
            );
        }

        return login("gestor.centro");
    }

    private String login(String usuario) throws Exception {
        MvcResult resultado = mvc.perform(post("/api/equipe/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"login":"%s","senha":"minhavez"}
                                """.formatted(usuario)))
                .andExpect(status().isOk())
                .andReturn();
        return token(resultado);
    }

    private void encaminhamento(String protocolo, Especialidade especialidade, UnidadeSaude unidadeOrigem) {
        acervo.adicionarEncaminhamento(new Encaminhamento(
                acervo.proximoId(),
                protocolo,
                acervo.buscarPorCpf(CPF).orElseThrow(),
                especialidade,
                unidadeOrigem,
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

    private static String token(MvcResult resultado) throws Exception {
        String corpo = corpo(resultado);
        int inicio = corpo.indexOf("\"token\":\"") + "\"token\":\"".length();
        return corpo.substring(inicio, corpo.indexOf('"', inicio));
    }

    private static String corpo(MvcResult resultado) throws Exception {
        return resultado.getResponse().getContentAsString(StandardCharsets.UTF_8);
    }
}
