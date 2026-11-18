package com.hackgov.backend.equipe;

import com.hackgov.backend.api.ApiException;
import com.hackgov.backend.domain.Encaminhamento;
import com.hackgov.backend.domain.PerfilUsuario;
import com.hackgov.backend.domain.StatusEncaminhamento;
import com.hackgov.backend.domain.UnidadeSaude;
import com.hackgov.backend.domain.UsuarioInstitucional;
import com.hackgov.backend.identificacao.AreaPessoal;
import com.hackgov.backend.identificacao.Credencial;
import com.hackgov.backend.identificacao.SenhaHash;
import com.hackgov.backend.memoria.AcervoMinhaVez;
import org.springframework.stereotype.Service;

@Service
public class ServicoDeEquipe {

    private final AcervoMinhaVez acervo;

    public ServicoDeEquipe(AcervoMinhaVez acervo) {
        this.acervo = acervo;
    }

    public UsuarioInstitucional registrar(
            String nome,
            String login,
            String senha,
            PerfilUsuario perfil,
            UnidadeSaude unidade) {

        if (login == null || login.isBlank()) {
            throw new ApiException(400, "DADOS_INVALIDOS", "Informe o login da equipe.");
        }

        UsuarioInstitucional usuario = new UsuarioInstitucional(
                acervo.proximoId(),
                nome,
                login.trim(),
                perfil,
                unidade
        );

        acervo.guardarEquipe(usuario, Credencial.comSenha(SenhaHash.gerar(senha)));
        return usuario;
    }

    public RespostaLoginEquipe entrar(PedidoLoginEquipe pedido) {
        if (pedido == null || pedido.login() == null || pedido.login().isBlank()
                || pedido.senha() == null || pedido.senha().isBlank()) {
            throw new ApiException(400, "DADOS_INVALIDOS", "Informe o login e a senha da equipe.");
        }

        UsuarioInstitucional usuario = acervo.buscarEquipePorLogin(pedido.login().trim()).orElse(null);
        Credencial credencial = usuario == null
                ? null
                : acervo.credencialEquipe(usuario.getId()).orElse(null);

        if (usuario == null || credencial == null || !credencial.temSenha()
                || !credencial.getSenha().confere(pedido.senha())) {
            throw new ApiException(401, "SENHA_INCORRETA", "Login ou senha não conferem. Tente de novo.");
        }

        return new RespostaLoginEquipe(acervo.abrirSessaoEquipe(usuario.getId()), "EQUIPE");
    }

    public StatusAtualizadoResposta atualizarStatus(String token, String protocolo, PedidoDeStatus pedido) {
        if (acervo.buscarSessao(token).isPresent()) {
            throw new ApiException(
                    403,
                    "ACESSO_NEGADO",
                    "Esta ação é do canal da equipe."
            );
        }

        UsuarioInstitucional usuario = acervo.buscarEquipePorToken(token).orElseThrow(
                () -> new ApiException(
                        401,
                        "SESSAO_INVALIDA",
                        "Não há sessão de equipe ativa. Entre de novo."
                )
        );

        if (pedido == null || pedido.status() == null || pedido.status().isBlank()) {
            throw new ApiException(400, "DADOS_INVALIDOS", "Informe a nova etapa.");
        }

        StatusEncaminhamento novoStatus;

        try {
            novoStatus = StatusEncaminhamento.valueOf(pedido.status());
        } catch (IllegalArgumentException erro) {
            throw new ApiException(400, "DADOS_INVALIDOS", "Informe uma etapa válida.");
        }

        Encaminhamento encaminhamento = acervo.buscarEncaminhamentoPorProtocolo(protocolo).orElseThrow(
                () -> new ApiException(
                        404,
                        "ENCAMINHAMENTO_NAO_ENCONTRADO",
                        "Não encontramos esse encaminhamento."
                )
        );

        if (!usuario.getUnidade().equals(encaminhamento.getUnidadeOrigem())) {
            throw new ApiException(
                    403,
                    "ACESSO_NEGADO",
                    "Este encaminhamento é de outra unidade."
            );
        }

        usuario.atualizarEncaminhamento(encaminhamento, novoStatus);

        return new StatusAtualizadoResposta(
                encaminhamento.getProtocolo(),
                encaminhamento.getStatus().name(),
                AreaPessoal.rotulo(encaminhamento.getStatus())
        );
    }
}
