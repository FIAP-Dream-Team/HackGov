package com.hackgov.backend.agendamento;

import com.hackgov.backend.api.ApiException;
import com.hackgov.backend.domain.Agendamento;
import com.hackgov.backend.domain.Encaminhamento;
import com.hackgov.backend.domain.HorarioDisponivel;
import com.hackgov.backend.domain.StatusEncaminhamento;
import com.hackgov.backend.identificacao.Canal;
import com.hackgov.backend.identificacao.Sessao;
import com.hackgov.backend.memoria.AcervoMinhaVez;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * App-only scheduling. Availability, the 24-hour window and the
 * reschedule limit stay on the domain objects.
 */
@Service
public class ServicoDeAgendamento {

    private static final DateTimeFormatter HORA = DateTimeFormatter.ofPattern("HH:mm");
    private static final DateTimeFormatter DATA_LEITURA = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private static final String SEM_VAGA =
            "Não há horário livre para esta especialidade nesta unidade. Volte ao acompanhamento.";

    private static final String SEM_OUTRO_HORARIO =
            "Não há outro horário livre para reagendar. Volte ao acompanhamento. "
                    + "O horário atual continua marcado.";

    private final AcervoMinhaVez acervo;

    public ServicoDeAgendamento(AcervoMinhaVez acervo) {
        this.acervo = acervo;
    }

    public synchronized ListaDeHorariosResposta listar(String token, String protocolo) {
        Encaminhamento encaminhamento = encaminhamentoDoApp(token, protocolo);
        List<HorarioDisponivel> livres = encaminhamento.getStatus() == StatusEncaminhamento.AGENDADO
                ? encaminhamento.reabrirLista()
                : encaminhamento.solicitarAgendamento();

        return lista(encaminhamento, livres);
    }

    public synchronized ConfirmacaoResposta confirmar(
            String token,
            String protocolo,
            PedidoDeHorario pedido) {

        Encaminhamento encaminhamento = encaminhamentoDoApp(token, protocolo);
        HorarioDisponivel horario = horarioEscolhido(encaminhamento, pedido);
        Agendamento agendamento = encaminhamento.selecionarHorario(horario);
        return confirmacao(encaminhamento, agendamento, null, "Horário confirmado");
    }

    public synchronized CancelamentoResposta cancelar(
            String token,
            String protocolo,
            PedidoDeCancelamento pedido) {

        Encaminhamento encaminhamento = encaminhamentoDoApp(token, protocolo);

        if (pedido == null || !Boolean.TRUE.equals(pedido.confirmado())) {
            throw new ApiException(
                    400,
                    "CONFIRMACAO_AUSENTE",
                    "Para cancelar, confirme a ação. Sem a confirmação, o horário permanece marcado."
            );
        }

        encaminhamento.cancelarAgendamento(encaminhamento.agendamentoAtivo());

        return new CancelamentoResposta(
                encaminhamento.getProtocolo(),
                encaminhamento.getStatus().name(),
                "Horário cancelado. O encaminhamento voltou para aguardando agendamento."
        );
    }

    public synchronized ConfirmacaoResposta reagendar(
            String token,
            String protocolo,
            PedidoDeHorario pedido) {

        Encaminhamento encaminhamento = encaminhamentoDoApp(token, protocolo);
        Agendamento atual = encaminhamento.agendamentoAtivo();
        HorarioDisponivel horario = horarioEscolhido(encaminhamento, pedido);
        Agendamento novo = encaminhamento.reagendar(atual, horario);
        return confirmacao(encaminhamento, novo, atual.getId(), "Horário reagendado");
    }

    private ListaDeHorariosResposta lista(
            Encaminhamento encaminhamento,
            List<HorarioDisponivel> livres) {

        List<HorarioLivreResposta> itens = new ArrayList<>();

        for (HorarioDisponivel horario : livres) {
            itens.add(new HorarioLivreResposta(
                    horario.getId(),
                    horario.getDataHora().toLocalDate().toString(),
                    HORA.format(horario.getDataHora()),
                    horario.getEspecialidade().getNome(),
                    horario.getUnidade().getNome()
            ));
        }

        boolean temHorario = !itens.isEmpty();

        return new ListaDeHorariosResposta(
                temHorario,
                encaminhamento.getProtocolo(),
                encaminhamento.getEspecialidade().getNome(),
                encaminhamento.getUnidadeDestino().getNome(),
                temHorario ? mensagemDeReabertura(encaminhamento) : mensagemDeAusencia(encaminhamento),
                List.copyOf(itens)
        );
    }

    private static String mensagemDeReabertura(Encaminhamento encaminhamento) {
        if (encaminhamento.getStatus() == StatusEncaminhamento.AGENDADO) {
            return "Escolha outro horário livre. O horário atual continua marcado até a confirmação do reagendamento.";
        }

        return null;
    }

    private static String mensagemDeAusencia(Encaminhamento encaminhamento) {
        if (encaminhamento.getStatus() == StatusEncaminhamento.AGENDADO) {
            return SEM_OUTRO_HORARIO;
        }

        return SEM_VAGA;
    }

    private ConfirmacaoResposta confirmacao(
            Encaminhamento encaminhamento,
            Agendamento agendamento,
            Long agendamentoAnteriorId,
            String acao) {

        HorarioDisponivel horario = agendamento.getHorario();
        String data = agendamento.getDataHora().toLocalDate().toString();
        String hora = HORA.format(agendamento.getDataHora());
        String especialidade = horario.getEspecialidade().getNome();
        String unidade = horario.getUnidade().getNome();

        return new ConfirmacaoResposta(
                encaminhamento.getProtocolo(),
                especialidade,
                data,
                hora,
                unidade,
                encaminhamento.getStatus().name(),
                agendamento.getId(),
                agendamentoAnteriorId,
                "%s: %s, %s às %s, protocolo %s, %s.".formatted(
                        acao,
                        especialidade,
                        DATA_LEITURA.format(agendamento.getDataHora()),
                        hora,
                        encaminhamento.getProtocolo(),
                        unidade
                )
        );
    }

    private HorarioDisponivel horarioEscolhido(Encaminhamento encaminhamento, PedidoDeHorario pedido) {
        if (pedido == null || pedido.horarioId() == null) {
            throw new ApiException(400, "DADOS_INVALIDOS", "Informe o horário escolhido.");
        }

        HorarioDisponivel horario = encaminhamento.getEspecialidade().buscarHorario(pedido.horarioId());

        if (horario == null) {
            throw new ApiException(
                    404,
                    "HORARIO_NAO_ENCONTRADO",
                    "Não encontramos esse horário."
            );
        }

        return horario;
    }

    private Encaminhamento encaminhamentoDoApp(String token, String protocolo) {
        if (acervo.buscarEquipePorToken(token).isPresent()) {
            throw new ApiException(
                    403,
                    "ACESSO_NEGADO",
                    "O agendamento é feito pelo aplicativo do cidadão."
            );
        }

        Sessao sessao = acervo.buscarSessao(token).orElseThrow(
                () -> new ApiException(
                        401,
                        "SESSAO_INVALIDA",
                        "Não há sessão ativa. Identifique-se de novo."
                )
        );

        if (sessao.getCanal() != Canal.APP) {
            throw new ApiException(
                    403,
                    "ACESSO_NEGADO",
                    "O totem só acompanha a etapa. Para marcar horário, use o aplicativo."
            );
        }

        return acervo.buscarEncaminhamentoPorProtocolo(protocolo)
                .filter(item -> item.getCidadao().getId().equals(sessao.getCidadaoId()))
                .orElseThrow(() -> new ApiException(
                        404,
                        "ENCAMINHAMENTO_NAO_ENCONTRADO",
                        "Não encontramos esse encaminhamento."
                ));
    }
}
