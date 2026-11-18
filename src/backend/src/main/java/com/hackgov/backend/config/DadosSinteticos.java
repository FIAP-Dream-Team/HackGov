package com.hackgov.backend.config;

import com.hackgov.backend.domain.Cidadao;
import com.hackgov.backend.domain.Encaminhamento;
import com.hackgov.backend.domain.Especialidade;
import com.hackgov.backend.domain.PerfilUsuario;
import com.hackgov.backend.domain.TipoUnidade;
import com.hackgov.backend.domain.UnidadeSaude;
import com.hackgov.backend.equipe.ServicoDeEquipe;
import com.hackgov.backend.identificacao.ServicoDeIdentificacao;
import com.hackgov.backend.memoria.AcervoMinhaVez;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * Synthetic demo data for local runs. These are not real patients.
 */
@Component
@ConditionalOnProperty(name = "hackgov.seed", havingValue = "true", matchIfMissing = true)
public class DadosSinteticos implements CommandLineRunner {

    static final String CPF = "52998224725";
    static final String CARTAO_SUS = "100000000060018";
    static final LocalDate NASCIMENTO = LocalDate.of(1988, 4, 12);
    static final String SENHA = "minhavez";
    static final String LOGIN_EQUIPE = "atendente.centro";

    private final ServicoDeIdentificacao identificacao;
    private final ServicoDeEquipe equipe;
    private final AcervoMinhaVez acervo;

    public DadosSinteticos(
            ServicoDeIdentificacao identificacao,
            ServicoDeEquipe equipe,
            AcervoMinhaVez acervo) {
        this.identificacao = identificacao;
        this.equipe = equipe;
        this.acervo = acervo;
    }

    @Override
    public void run(String... args) {
        Cidadao cidadao = identificacao.registrar(
                "Maria Andrade",
                CPF,
                NASCIMENTO,
                CARTAO_SUS,
                SENHA,
                false
        );

        UnidadeSaude origem = unidade(acervo.proximoId(), "UBS Centro", TipoUnidade.UBS);

        acervo.adicionarEncaminhamento(new Encaminhamento(
                acervo.proximoId(),
                "MV-2026-0001",
                cidadao,
                new Especialidade(acervo.proximoId(), "Cardiologia"),
                origem,
                unidade(acervo.proximoId(), "Ambulatório Central", TipoUnidade.ESPECIALIZADA)
        ));

        equipe.registrar(
                "Ana Atendente",
                LOGIN_EQUIPE,
                SENHA,
                PerfilUsuario.ATENDENTE,
                origem
        );
    }

    private static UnidadeSaude unidade(long id, String nome, TipoUnidade tipo) {
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
}
