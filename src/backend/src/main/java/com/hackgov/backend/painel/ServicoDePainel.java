package com.hackgov.backend.painel;

import com.hackgov.backend.api.ApiException;
import com.hackgov.backend.equipe.RegrasDePerfil;
import com.hackgov.backend.domain.Chamada;
import com.hackgov.backend.domain.Encaminhamento;
import com.hackgov.backend.domain.UsuarioInstitucional;
import com.hackgov.backend.memoria.AcervoMinhaVez;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Painel da sala de espera. O que sai para o público é a senha e a sala.
 * O estado amarelo é a senha chamada, não uma coluna gravada.
 */
@Service
public class ServicoDePainel implements AtualizacaoDoPainel {

    private static final long DURACAO_MS = 30L * 60L * 1000L;

    private static final String SEM_CHAMADA = "Nenhuma senha chamada no momento.";
    private static final String VEZ = "É a vez de alguém.";

    private final AcervoMinhaVez acervo;
    private final List<SseEmitter> emissores = new CopyOnWriteArrayList<>();

    public ServicoDePainel(AcervoMinhaVez acervo) {
        this.acervo = acervo;
    }

    public PainelResposta atual() {
        return acervo.chamadaAtiva()
                .map(ServicoDePainel::exibir)
                .orElseGet(ServicoDePainel::vazia);
    }

    public SseEmitter abrirEventos() {
        SseEmitter emissor = new SseEmitter(DURACAO_MS);
        emissores.add(emissor);
        emissor.onCompletion(() -> emissores.remove(emissor));
        emissor.onTimeout(() -> emissores.remove(emissor));
        emissor.onError(erro -> emissores.remove(emissor));
        enviar(emissor, atual());
        return emissor;
    }

    public PainelResposta chamar(String token, String protocolo, PedidoDeChamada pedido) {
        if (acervo.buscarSessao(token).isPresent()) {
            throw new ApiException(
                    403,
                    "ACESSO_NEGADO",
                    "A chamada na sala de espera é feita pela equipe."
            );
        }

        UsuarioInstitucional usuario = acervo.buscarEquipePorToken(token).orElseThrow(
                () -> new ApiException(
                        401,
                        "SESSAO_INVALIDA",
                        "Não há sessão de equipe ativa. Entre de novo."
                )
        );

        RegrasDePerfil.exigirAtendente(usuario);

        if (pedido == null
                || pedido.senha() == null || pedido.senha().isBlank()
                || pedido.sala() == null || pedido.sala().isBlank()) {
            throw new ApiException(400, "DADOS_INVALIDOS", "Informe a senha e a sala.");
        }

        Encaminhamento encaminhamento = acervo.buscarEncaminhamentoPorProtocolo(protocolo).orElseThrow(
                () -> new ApiException(
                        404,
                        "ENCAMINHAMENTO_NAO_ENCONTRADO",
                        "Não encontramos esse encaminhamento."
                )
        );

        // Mesma regra de liberar e registrar falta: a equipe só age sobre
        // encaminhamentos da própria unidade de lotação.
        if (!usuario.getUnidade().equals(encaminhamento.getUnidadeOrigem())) {
            throw new ApiException(
                    403,
                    "ACESSO_NEGADO",
                    "Este encaminhamento é de outra unidade."
            );
        }

        Chamada chamada = usuario.chamar(
                acervo.proximoId(),
                encaminhamento.agendamentoAtivo(),
                pedido.senha(),
                pedido.sala()
        );
        acervo.adicionarChamada(chamada);
        painelMudou();
        return exibir(chamada);
    }

    @Override
    public void painelMudou() {
        PainelResposta estado = atual();

        for (SseEmitter emissor : emissores) {
            enviar(emissor, estado);
        }
    }

    private void enviar(SseEmitter emissor, PainelResposta estado) {
        try {
            emissor.send(SseEmitter.event().name("painel").data(estado));
        } catch (Exception erro) {
            // A tela que soltou a conexão não pode derrubar a chamada nem o cancelamento.
            emissores.remove(emissor);
            try {
                emissor.complete();
            } catch (Exception ignorado) {
                // A tela da sala de espera já soltou a conexão.
            }
        }
    }

    private static PainelResposta exibir(Chamada chamada) {
        return new PainelResposta(
                true,
                chamada.getSenha(),
                chamada.getSala(),
                "CHAMADA",
                "AMARELO",
                VEZ
        );
    }

    private static PainelResposta vazia() {
        return new PainelResposta(false, null, null, null, null, SEM_CHAMADA);
    }
}
