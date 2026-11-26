package com.hackgov.backend.seguranca;

import com.hackgov.backend.domain.Encaminhamento;
import com.hackgov.backend.domain.Especialidade;
import com.hackgov.backend.domain.PerfilUsuario;
import com.hackgov.backend.domain.TipoUnidade;
import com.hackgov.backend.domain.UnidadeSaude;
import com.hackgov.backend.equipe.ServicoDeEquipe;
import com.hackgov.backend.memoria.AcervoMinhaVez;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;

import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Parte 4 (segurança): limite de tentativas, validade da sessão, logout da
 * equipe e segregação de funções entre atendente e gestor.
 */
@SpringBootTest
@AutoConfigureMockMvc
class SegurancaHttpTest {

    private static final String CPF = "39053344705";
    private static final String NASCIMENTO = "1992-07-03";

    @Autowired
    private MockMvc mvc;

    @Autowired
    private AcervoMinhaVez acervo;

    @Autowired
    private ServicoDeEquipe equipe;

    private RelogioDeTeste relogio;
    private UnidadeSaude unidade;

    @BeforeEach
    void preparar() throws Exception {
        acervo.limpar();
        relogio = new RelogioDeTeste(Instant.parse("2026-11-24T12:00:00Z"));
        acervo.usarRelogio(relogio);
        unidade = new UnidadeSaude(acervo.proximoId(), "UBS Centro", TipoUnidade.UBS, null,
                "Rua das Flores", "100", null, "Centro", "São Paulo", "SP", "01001000");
        equipe.registrar("Atendente", "atendente.centro", "minhavez", PerfilUsuario.ATENDENTE, unidade);
        equipe.registrar("Gestor", "gestor.centro", "minhavez", PerfilUsuario.GESTOR, unidade);

        mvc.perform(post("/api/app/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nome":"Pessoa Teste","cpf":"%s","dataNascimento":"%s","senha":"minhavez"}
                                """.formatted(CPF, NASCIMENTO)))
                .andExpect(status().isCreated());
    }

    @AfterEach
    void restaurar() {
        acervo.limpar();
    }

    // ------------------------------------------------- limite de tentativas

    @Test
    void cincoSenhasErradasBloqueiamAteASenhaCertaPorCincoMinutos() throws Exception {
        for (int i = 0; i < AcervoMinhaVez.MAXIMO_DE_TENTATIVAS; i++) {
            loginApp("errada" + i + "xx").andExpect(status().isUnauthorized());
        }

        loginApp("minhavez")
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.codigo").value("MUITAS_TENTATIVAS"))
                .andExpect(jsonPath("$.mensagem").value(
                        "Muitas tentativas erradas seguidas. Por segurança, o acesso fica bloqueado por 5 minutos."));

        relogio.avancar(AcervoMinhaVez.BLOQUEIO.plusSeconds(1));

        loginApp("minhavez").andExpect(status().isOk());
    }

    @Test
    void acertoZeraAContagemDeErros() throws Exception {
        for (int i = 0; i < AcervoMinhaVez.MAXIMO_DE_TENTATIVAS - 1; i++) {
            loginApp("errada" + i + "xx").andExpect(status().isUnauthorized());
        }
        loginApp("minhavez").andExpect(status().isOk());

        for (int i = 0; i < AcervoMinhaVez.MAXIMO_DE_TENTATIVAS - 1; i++) {
            loginApp("errada" + i + "xx").andExpect(status().isUnauthorized());
        }
        loginApp("minhavez").andExpect(status().isOk());
    }

    @Test
    void cpfSemCadastroTambemContaEBloqueiaSemRevelarSeExiste() throws Exception {
        for (int i = 0; i < AcervoMinhaVez.MAXIMO_DE_TENTATIVAS; i++) {
            mvc.perform(post("/api/app/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"cpf\":\"52998224725\",\"senha\":\"qualquer1\"}"))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.codigo").value("SENHA_INCORRETA"));
        }

        mvc.perform(post("/api/app/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"cpf\":\"52998224725\",\"senha\":\"qualquer1\"}"))
                .andExpect(status().isTooManyRequests());
    }

    @Test
    void loginDaEquipeTambemBloqueiaDepoisDeCincoErros() throws Exception {
        for (int i = 0; i < AcervoMinhaVez.MAXIMO_DE_TENTATIVAS; i++) {
            loginEquipe("atendente.centro", "errada" + i + "xx").andExpect(status().isUnauthorized());
        }

        loginEquipe("atendente.centro", "minhavez")
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.codigo").value("MUITAS_TENTATIVAS"));
    }

    @Test
    void totemBloqueiaQuemChutaDataDeNascimento() throws Exception {
        for (int dia = 1; dia <= AcervoMinhaVez.MAXIMO_DE_TENTATIVAS; dia++) {
            totem("1992-07-1" + dia).andExpect(status().isNotFound());
        }

        totem(NASCIMENTO)
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.codigo").value("MUITAS_TENTATIVAS"));
    }

    // ------------------------------------------------------ validade da sessão

    @Test
    void sessaoDoAplicativoExpiraDepoisDeTrintaMinutosParada() throws Exception {
        String token = token(loginApp("minhavez").andExpect(status().isOk()).andReturn());

        relogio.avancar(AcervoMinhaVez.INATIVIDADE_APP.plusSeconds(1));

        mvc.perform(get("/api/acompanhamento").header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.codigo").value("SESSAO_INVALIDA"));
    }

    @Test
    void usoRenovaASessaoDoAplicativo() throws Exception {
        String token = token(loginApp("minhavez").andExpect(status().isOk()).andReturn());

        relogio.avancar(Duration.ofMinutes(20));
        mvc.perform(get("/api/acompanhamento").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        relogio.avancar(Duration.ofMinutes(20));
        mvc.perform(get("/api/acompanhamento").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void sessaoDoTotemExpiraEmTresMinutos() throws Exception {
        String token = token(totem(NASCIMENTO).andExpect(status().isOk()).andReturn());

        relogio.avancar(AcervoMinhaVez.INATIVIDADE_TOTEM.plusSeconds(1));

        mvc.perform(get("/api/acompanhamento").header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void sessaoDaEquipeExpiraDepoisDeTrintaMinutosParada() throws Exception {
        String token = tokenEquipe("atendente.centro");

        relogio.avancar(AcervoMinhaVez.INATIVIDADE_EQUIPE.plusSeconds(1));

        mvc.perform(get("/api/equipe/fila").header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.codigo").value("SESSAO_INVALIDA"));
    }

    // -------------------------------------------------------- logout da equipe

    @Test
    void sairDaEquipeInvalidaOTokenNoServidor() throws Exception {
        String token = tokenEquipe("atendente.centro");

        mvc.perform(delete("/api/equipe/sessao").header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());

        mvc.perform(get("/api/equipe/fila").header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized());

        mvc.perform(delete("/api/equipe/sessao").header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized());
    }

    // ---------------------------------------------------- segregação de funções

    @Test
    void loginEFilaInformamOPerfil() throws Exception {
        loginEquipe("gestor.centro", "minhavez").andExpect(jsonPath("$.perfil").value("GESTOR"));

        mvc.perform(get("/api/equipe/fila").header("Authorization", "Bearer " + tokenEquipe("atendente.centro")))
                .andExpect(jsonPath("$.perfil").value("ATENDENTE"));
    }

    @Test
    void atendenteNaoConcluiEncaminhamento() throws Exception {
        mvc.perform(post("/api/equipe/encaminhamentos/MV-2026-0001/status")
                        .header("Authorization", "Bearer " + tokenEquipe("atendente.centro"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"CONCLUIDO\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.mensagem").value("Concluir um encaminhamento é do gestor da unidade."));
    }

    @Test
    void gestorNaoOperaAFila() throws Exception {
        String gestor = tokenEquipe("gestor.centro");

        mvc.perform(post("/api/equipe/encaminhamentos/MV-2026-0001/status")
                        .header("Authorization", "Bearer " + gestor)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"AGUARDANDO_AGENDAMENTO\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.codigo").value("ACESSO_NEGADO"));

        mvc.perform(post("/api/equipe/encaminhamentos/MV-2026-0001/falta")
                        .header("Authorization", "Bearer " + gestor))
                .andExpect(status().isForbidden());

        mvc.perform(post("/api/equipe/encaminhamentos/MV-2026-0001/chamada")
                        .header("Authorization", "Bearer " + gestor)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"senha\":\"A12\",\"sala\":\"2\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void equipeNaoChamaSenhaDeOutraUnidade() throws Exception {
        UnidadeSaude outraUbs = new UnidadeSaude(acervo.proximoId(), "UBS Norte", TipoUnidade.UBS, null,
                "Rua B", "1", null, "Norte", "São Paulo", "SP", "02002000");
        equipe.registrar("Atendente Norte", "atendente.norte", "minhavez", PerfilUsuario.ATENDENTE, outraUbs);

        Especialidade cardiologia = new Especialidade(acervo.proximoId(), "Cardiologia");
        Encaminhamento encaminhamento = new Encaminhamento(acervo.proximoId(), "MV-2026-0042",
                acervo.buscarPorCpf(CPF).orElseThrow(), cardiologia, unidade, unidade);
        acervo.adicionarEncaminhamento(encaminhamento);

        mvc.perform(post("/api/equipe/encaminhamentos/MV-2026-0042/chamada")
                        .header("Authorization", "Bearer " + tokenEquipe("atendente.norte"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"senha\":\"A12\",\"sala\":\"2\"}"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.mensagem").value("Este encaminhamento é de outra unidade."));
    }

    // ------------------------------------------------------ proteção contra iframe

    @Test
    void respostasProibemAbrirOSistemaDentroDeIframe() throws Exception {
        mvc.perform(get("/api/painel"))
                .andExpect(header().string("X-Frame-Options", "DENY"))
                .andExpect(header().string("Content-Security-Policy", "frame-ancestors 'none'"));

        // Vale também para resposta de erro, não só para as de sucesso.
        mvc.perform(get("/api/equipe/fila"))
                .andExpect(status().isUnauthorized())
                .andExpect(header().string("X-Frame-Options", "DENY"));
    }

    // ----------------------------------------------------------------- apoio

    private ResultActions loginApp(String senha) throws Exception {
        return mvc.perform(post("/api/app/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"cpf\":\"%s\",\"senha\":\"%s\"}".formatted(CPF, senha)));
    }

    private ResultActions loginEquipe(String login, String senha) throws Exception {
        return mvc.perform(post("/api/equipe/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"login\":\"%s\",\"senha\":\"%s\"}".formatted(login, senha)));
    }

    private ResultActions totem(String nascimento) throws Exception {
        return mvc.perform(post("/api/totem/identificacao")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"cpf\":\"%s\",\"dataNascimento\":\"%s\"}".formatted(CPF, nascimento)));
    }

    private String tokenEquipe(String login) throws Exception {
        return token(loginEquipe(login, "minhavez").andExpect(status().isOk()).andReturn());
    }

    private static String token(MvcResult resultado) throws Exception {
        String corpo = resultado.getResponse().getContentAsString(StandardCharsets.UTF_8);
        int inicio = corpo.indexOf("\"token\":\"") + "\"token\":\"".length();
        return corpo.substring(inicio, corpo.indexOf('"', inicio));
    }

    /** Relógio que o teste adianta à mão, para simular minutos sem esperar. */
    private static final class RelogioDeTeste extends Clock {
        private Instant agora;

        RelogioDeTeste(Instant inicio) {
            this.agora = inicio;
        }

        void avancar(Duration tempo) {
            agora = agora.plus(tempo);
        }

        @Override
        public ZoneId getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(ZoneId zone) {
            return this;
        }

        @Override
        public Instant instant() {
            return agora;
        }
    }
}
