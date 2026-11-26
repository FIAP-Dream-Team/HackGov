package com.hackgov.backend.identificacao;

import com.hackgov.backend.domain.Cidadao;
import com.hackgov.backend.domain.Encaminhamento;
import com.hackgov.backend.domain.Especialidade;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class IdentificacaoHttpTest {

    private static final String NOME = "NOMESECRETO Andrade";

    @Autowired
    private MockMvc mvc;

    @Autowired
    private AcervoMinhaVez acervo;

    @BeforeEach
    void limpar() {
        acervo.limpar();
    }

    @Test
    void totemAceitaCartaoSusSemSenhaEAbreAAreaPessoal() throws Exception {
        cadastrarComCartao();
        encaminhamentoDoCpf("39053344705", "MV-2026-0099");

        MvcResult resultado = mvc.perform(post("/api/totem/identificacao")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"cartaoSus":"700000000000005"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.canal").value("TOTEM"))
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.nome").doesNotExist())
                .andExpect(jsonPath("$.areaPessoal.temEncaminhamento").value(true))
                .andExpect(jsonPath("$.areaPessoal.encaminhamentos[0].protocolo").value("MV-2026-0099"))
                .andExpect(jsonPath("$.areaPessoal.encaminhamentos[0].status").value("RECEBIDO_TRIADO"))
                .andExpect(jsonPath("$.areaPessoal.encaminhamentos[0].rotulo").value("Recebido e triado"))
                .andExpect(jsonPath("$.areaPessoal.encaminhamentos[0].agendamentos").isEmpty())
                .andReturn();

        assertFalse(corpo(resultado).contains("NOMESECRETO"));
        assertFalse(corpo(resultado).contains("urgente"));
    }

    @Test
    void totemAceitaCpfComNascimentoERecusaSenha() throws Exception {
        cadastrarComCartao();

        mvc.perform(post("/api/totem/identificacao")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"cpf":"390.533.447-05","dataNascimento":"1992-07-03"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.canal").value("TOTEM"))
                .andExpect(jsonPath("$.areaPessoal.temEncaminhamento").value(false))
                .andExpect(jsonPath("$.areaPessoal.encaminhamentos").isEmpty());

        int sessoesDepoisDaIdentificacao = acervo.sessoesAbertas();

        mvc.perform(post("/api/totem/identificacao")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"cartaoSus":"700000000000005","senha":"minhavez"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.codigo").value("CANAL_INCORRETO"));

        assertEquals(sessoesDepoisDaIdentificacao, acervo.sessoesAbertas());
    }

    @Test
    void totemNaoEncontradoNaoAbreSessao() throws Exception {
        mvc.perform(post("/api/totem/identificacao")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"cpf":"52998224725","dataNascimento":"1988-04-12"}
                                """))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.codigo").value("CIDADAO_NAO_ENCONTRADO"))
                .andExpect(jsonPath("$.token").doesNotExist())
                .andExpect(jsonPath("$.mensagem").value(
                        "Não encontramos um cadastro com esses dados. Confira o número ou peça ajuda no balcão."
                ));

        assertEquals(0, acervo.sessoesAbertas());
    }

    @Test
    void cpfInvalidoNoTotemNaoPareceErroDeSistema() throws Exception {
        mvc.perform(post("/api/totem/identificacao")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"cpf":"123","dataNascimento":"1988-04-12"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.codigo").value("DADOS_INVALIDOS"));
    }

    @Test
    void appCadastraEEntraComCpfESenha() throws Exception {
        MvcResult cadastro = mvc.perform(post("/api/app/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome":"NOMESECRETO Andrade",
                                  "cpf":"11144477735",
                                  "dataNascimento":"2001-01-09",
                                  "senha":"minhavez"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.canal").value("APP"))
                .andExpect(jsonPath("$.provedor").doesNotExist())
                .andExpect(jsonPath("$.nome").doesNotExist())
                .andExpect(jsonPath("$.areaPessoal.temEncaminhamento").value(false))
                .andReturn();

        assertFalse(corpo(cadastro).contains("NOMESECRETO"));

        mvc.perform(post("/api/app/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"cpf":"11144477735","senha":"senha-errada"}
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.codigo").value("SENHA_INCORRETA"));

        MvcResult login = mvc.perform(post("/api/app/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"cpf":"111.444.777-35","senha":"minhavez"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.canal").value("APP"))
                .andReturn();

        mvc.perform(get("/api/sessoes/atual")
                        .header("Authorization", "Bearer " + token(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.areaPessoal.temEncaminhamento").value(false));
    }

    @Test
    void cadastroRepetidoNaoCriaOutraSessao() throws Exception {
        cadastrarComCartao();
        int sessoes = acervo.sessoesAbertas();

        mvc.perform(post("/api/app/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome":"Outra Pessoa",
                                  "cpf":"39053344705",
                                  "dataNascimento":"1992-07-03",
                                  "senha":"minhavez"
                                }
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.codigo").value("CPF_JA_CADASTRADO"));

        assertEquals(sessoes, acervo.sessoesAbertas());
    }

    @Test
    void govBrSimuladoCadastraSemSenhaENaoMisturaComOLogin() throws Exception {
        MvcResult oauth = mvc.perform(post("/api/app/oauth")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "provedor":"gov.br",
                                  "cpf":"52998224725",
                                  "nome":"NOMESECRETO Lima",
                                  "dataNascimento":"1988-04-12"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.canal").value("APP"))
                .andExpect(jsonPath("$.provedor").value("gov.br"))
                .andExpect(jsonPath("$.oauthSimulado").value(true))
                .andExpect(jsonPath("$.nome").doesNotExist())
                .andReturn();

        assertFalse(corpo(oauth).contains("NOMESECRETO"));

        mvc.perform(post("/api/app/oauth")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"provedor":"gov.br","cpf":"52998224725"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.oauthSimulado").value(true));

        mvc.perform(post("/api/app/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"cpf":"52998224725","senha":"minhavez"}
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.codigo").value("CONTA_GOVBR"));
    }

    @Test
    void encerrarSessaoDoTotemImpedeReuso() throws Exception {
        cadastrarComCartao();

        MvcResult entrada = mvc.perform(post("/api/totem/identificacao")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"cartaoSus":"700000000000005"}
                                """))
                .andExpect(status().isOk())
                .andReturn();

        String token = token(entrada);

        mvc.perform(delete("/api/sessoes/atual")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());

        mvc.perform(get("/api/sessoes/atual")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.codigo").value("SESSAO_INVALIDA"));
    }

    @Test
    void areaPessoalNaoMostraEncaminhamentoDeOutroCidadao() throws Exception {
        cadastrarComCartao();
        encaminhamentoDoCpf("39053344705", "MV-SO-DE-UM");

        mvc.perform(post("/api/app/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome":"Segunda Pessoa",
                                  "cpf":"11144477735",
                                  "dataNascimento":"2001-01-09",
                                  "senha":"minhavez"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.areaPessoal.encaminhamentos").isEmpty());

        mvc.perform(post("/api/totem/identificacao")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"cpf":"39053344705","dataNascimento":"1992-07-03"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.areaPessoal.encaminhamentos[0].protocolo").value("MV-SO-DE-UM"));
    }

    private void cadastrarComCartao() throws Exception {
        mvc.perform(post("/api/app/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome":"%s",
                                  "cpf":"39053344705",
                                  "dataNascimento":"1992-07-03",
                                  "cartaoSus":"700000000000005",
                                  "senha":"minhavez"
                                }
                                """.formatted(NOME)))
                .andExpect(status().isCreated());
    }

    private void encaminhamentoDoCpf(String cpf, String protocolo) {
        Cidadao cidadao = acervo.buscarPorCpf(cpf).orElseThrow();
        acervo.adicionarEncaminhamento(new Encaminhamento(
                acervo.proximoId(),
                protocolo,
                cidadao,
                new Especialidade(acervo.proximoId(), "Cardiologia"),
                unidade("UBS Centro", TipoUnidade.UBS),
                unidade("Ambulatório Central", TipoUnidade.ESPECIALIZADA)
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
