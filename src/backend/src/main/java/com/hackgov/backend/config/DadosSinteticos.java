package com.hackgov.backend.config;

import com.hackgov.backend.domain.Cidadao;
import com.hackgov.backend.domain.Encaminhamento;
import com.hackgov.backend.domain.Especialidade;
import com.hackgov.backend.domain.HorarioDisponivel;
import com.hackgov.backend.domain.PerfilUsuario;
import com.hackgov.backend.domain.StatusEncaminhamento;
import com.hackgov.backend.domain.TipoUnidade;
import com.hackgov.backend.domain.UnidadeSaude;
import com.hackgov.backend.domain.UsuarioInstitucional;
import com.hackgov.backend.equipe.ServicoDeEquipe;
import com.hackgov.backend.identificacao.ServicoDeIdentificacao;
import com.hackgov.backend.memoria.AcervoMinhaVez;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Dados sintéticos para a demonstração local. Não são pacientes reais.
 */
@Component
@ConditionalOnProperty(name = "hackgov.seed", havingValue = "true", matchIfMissing = true)
public class DadosSinteticos implements CommandLineRunner {

    static final String CPF = "52998224725";
    static final String CARTAO_SUS = "100000000060018";
    static final LocalDate NASCIMENTO = LocalDate.of(1988, 4, 12);
    static final String SENHA = "minhavez";
    static final String LOGIN_EQUIPE = "atendente.centro";
    static final String LOGIN_GESTOR = "gestor.centro";

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
        UnidadeSaude destino = unidade(
                acervo.proximoId(),
                "Ambulatório Central",
                TipoUnidade.ESPECIALIZADA
        );
        Especialidade cardiologia = new Especialidade(acervo.proximoId(), "Cardiologia");

        acervo.adicionarEncaminhamento(new Encaminhamento(
                acervo.proximoId(),
                "MV-2026-0001",
                cidadao,
                cardiologia,
                origem,
                destino
        ));

        // Horários livres sintéticos para a lista da demonstração não começar vazia.
        LocalDateTime base = LocalDateTime.now()
                .plusDays(7)
                .withMinute(0)
                .withSecond(0)
                .withNano(0);

        for (int hora : new int[] {8, 10, 14}) {
            cardiologia.publicarHorario(new HorarioDisponivel(
                    acervo.proximoId(),
                    cardiologia,
                    destino,
                    base.withHour(hora)
            ));
        }

        UsuarioInstitucional atendente = equipe.registrar(
                "Ana Atendente",
                LOGIN_EQUIPE,
                SENHA,
                PerfilUsuario.ATENDENTE,
                origem
        );

        semearDemonstracaoAmpliada(origem, destino, base, atendente);
    }

    /**
     * Mais pessoas e etapas para a fila, o acompanhamento e o painel não
     * ficarem com um caso só. Tudo sintético: nomes inventados, CPFs gerados
     * só para passar no dígito verificador. Só usa etapas alcançáveis sem
     * voltar no tempo: o domínio recusa agendamento no passado, por isso não
     * há falta nem encaminhamento concluído semeados.
     */
    private void semearDemonstracaoAmpliada(
            UnidadeSaude origem,
            UnidadeSaude destino,
            LocalDateTime base,
            UsuarioInstitucional atendente) {

        equipe.registrar(
                "Gabriel Gestor",
                LOGIN_GESTOR,
                SENHA,
                PerfilUsuario.GESTOR,
                origem
        );

        Especialidade dermatologia = new Especialidade(acervo.proximoId(), "Dermatologia");
        Especialidade ortopedia = new Especialidade(acervo.proximoId(), "Ortopedia");

        for (int hora : new int[] {9, 11, 15}) {
            dermatologia.publicarHorario(new HorarioDisponivel(
                    acervo.proximoId(), dermatologia, destino, base.plusDays(1).withHour(hora)));
        }

        // A Cardiologia fica só com os três horários da Maria (o teste da US03
        // conta esses três). O caso já agendado usa Ortopedia.
        for (int hora : new int[] {8, 10, 13}) {
            ortopedia.publicarHorario(new HorarioDisponivel(
                    acervo.proximoId(), ortopedia, destino, base.plusDays(2).withHour(hora)));
        }

        // Aguardando agendamento: aparece na fila com "Cobrar marcação".
        Encaminhamento joao = encaminhar("MV-2026-0002", cidadao(
                "João Pedro Ribeiro", "12345678143", LocalDate.of(1975, 9, 3)),
                dermatologia, origem, destino, false);
        joao.atualizarStatus(StatusEncaminhamento.AGUARDANDO_AGENDAMENTO, atendente);

        // Urgente, ainda em triagem.
        encaminhar("MV-2026-0003", cidadao(
                "Antônia Lima Dias", "98765432029", LocalDate.of(1952, 1, 27)),
                ortopedia, origem, destino, true);

        // Já agendado: dá para chamar a senha no painel sem passar pelo app.
        Encaminhamento carlos = encaminhar("MV-2026-0004", cidadao(
                "Carlos Eduardo Souza", "11144477735", LocalDate.of(1990, 6, 15)),
                ortopedia, origem, destino, false);
        carlos.atualizarStatus(StatusEncaminhamento.AGUARDANDO_AGENDAMENTO, atendente);
        carlos.selecionarHorario(ortopedia.consultarHorariosDisponiveis().stream()
                .filter(horario -> horario.getDataHora().equals(base.plusDays(2).withHour(10)))
                .findFirst()
                .orElseThrow());

        // Duas especialidades para a mesma pessoa: o app lista as duas.
        Cidadao lucia = cidadao("Lúcia Ferreira", "24681357928", LocalDate.of(1968, 11, 30));
        Encaminhamento luciaDerma = encaminhar("MV-2026-0005", lucia, dermatologia, origem, destino, false);
        luciaDerma.atualizarStatus(StatusEncaminhamento.AGUARDANDO_AGENDAMENTO, atendente);
        encaminhar("MV-2026-0006", lucia, ortopedia, origem, destino, false);

        // Cadastro sem encaminhamento: mostra o estado vazio do acompanhamento.
        cidadao("Pedro Henrique Lima", "13579246828", LocalDate.of(2001, 3, 8));
    }

    private Cidadao cidadao(String nome, String cpf, LocalDate nascimento) {
        return identificacao.registrar(nome, cpf, nascimento, null, SENHA, false);
    }

    private Encaminhamento encaminhar(
            String protocolo,
            Cidadao cidadao,
            Especialidade especialidade,
            UnidadeSaude origem,
            UnidadeSaude destino,
            boolean urgente) {

        Encaminhamento encaminhamento = new Encaminhamento(
                acervo.proximoId(), protocolo, cidadao, especialidade, origem, destino, urgente);
        acervo.adicionarEncaminhamento(encaminhamento);
        return encaminhamento;
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
