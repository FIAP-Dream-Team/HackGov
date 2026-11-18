package com.hackgov.backend.identificacao;

import com.hackgov.backend.api.ApiException;
import com.hackgov.backend.domain.Cidadao;
import com.hackgov.backend.memoria.AcervoMinhaVez;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

/**
 * Citizen identification for the kiosk and the app.
 * Gov.br is not a real OAuth redirect: the endpoint accepts the CPF the
 * provider would have asserted, and the response marks oauthSimulado.
 */
@Service
public class ServicoDeIdentificacao {

    private final AcervoMinhaVez acervo;
    private final AreaPessoal areaPessoal;

    public ServicoDeIdentificacao(AcervoMinhaVez acervo, AreaPessoal areaPessoal) {
        this.acervo = acervo;
        this.areaPessoal = areaPessoal;
    }

    public RespostaDeIdentificacao identificarNoTotem(PedidoTotem pedido) {
        if (pedido != null && preenchido(pedido.senha())) {
            throw new ApiException(
                    400,
                    "CANAL_INCORRETO",
                    "O totem não pede senha. Use o Cartão SUS ou o CPF com a data de nascimento."
            );
        }

        if (pedido == null) {
            throw dados("Informe o Cartão SUS ou o CPF com a data de nascimento.");
        }

        boolean temCartao = preenchido(pedido.cartaoSus());
        boolean temCpf = preenchido(pedido.cpf());

        if (!temCartao && !temCpf) {
            throw dados("Informe o Cartão SUS ou o CPF com a data de nascimento.");
        }

        if (temCpf && pedido.dataNascimento() == null) {
            throw dados("No totem, o CPF precisa vir com a data de nascimento.");
        }

        Cidadao porCartao = null;
        Cidadao porCpf = null;

        if (temCartao) {
            CartaoSus cartao = CartaoSus.analisar(pedido.cartaoSus());
            porCartao = acervo.buscarPorCartao(cartao.digitos()).orElse(null);
        }

        if (temCpf) {
            Cpf cpf = Cpf.analisar(pedido.cpf());
            Cidadao encontrado = acervo.buscarPorCpf(cpf.digitos()).orElse(null);

            if (encontrado != null && pedido.dataNascimento().equals(encontrado.getDataNascimento())) {
                porCpf = encontrado;
            }
        }

        Cidadao cidadao = resolverTotem(temCartao, temCpf, porCartao, porCpf);
        return responder(acervo.abrirSessao(Canal.TOTEM, cidadao.getId()), null, null);
    }

    public RespostaDeIdentificacao cadastrarNoApp(PedidoCadastro pedido) {
        if (pedido == null
                || !preenchido(pedido.nome())
                || !preenchido(pedido.cpf())
                || pedido.dataNascimento() == null) {
            throw dados("Informe nome, CPF e data de nascimento.");
        }

        if (!preenchido(pedido.senha())) {
            throw dados("No aplicativo, informe uma senha ou entre pelo Gov.br.");
        }

        Cidadao cidadao = registrar(
                pedido.nome(),
                pedido.cpf(),
                pedido.dataNascimento(),
                pedido.cartaoSus(),
                pedido.senha(),
                false
        );

        return responder(acervo.abrirSessao(Canal.APP, cidadao.getId()), null, null);
    }

    public RespostaDeIdentificacao entrarNoApp(PedidoLogin pedido) {
        if (pedido == null || !preenchido(pedido.cpf()) || !preenchido(pedido.senha())) {
            throw dados("No aplicativo, informe o CPF e a senha.");
        }

        Cpf cpf = Cpf.analisar(pedido.cpf());
        Cidadao cidadao = acervo.buscarPorCpf(cpf.digitos()).orElse(null);
        Credencial credencial = cidadao == null
                ? null
                : acervo.credencialDe(cidadao.getId()).orElse(null);

        if (cidadao == null || credencial == null) {
            throw senhaNaoConfere();
        }

        if (!credencial.temSenha()) {
            throw new ApiException(
                    401,
                    "CONTA_GOVBR",
                    "Esta conta não tem senha. Entre pelo Gov.br."
            );
        }

        if (!credencial.getSenha().confere(pedido.senha())) {
            throw senhaNaoConfere();
        }

        return responder(acervo.abrirSessao(Canal.APP, cidadao.getId()), null, null);
    }

    public RespostaDeIdentificacao entrarPeloGovBr(PedidoOauth pedido) {
        if (pedido == null || pedido.provedor() == null || !pedido.provedor().equals("gov.br")) {
            throw dados("Nesta fase o único acesso ilustrado é o Gov.br.");
        }

        Cpf cpf = Cpf.analisar(pedido.cpf());
        Cidadao cidadao = acervo.buscarPorCpf(cpf.digitos()).orElse(null);

        if (cidadao == null) {
            if (!preenchido(pedido.nome()) || pedido.dataNascimento() == null) {
                throw dados("Para o primeiro acesso pelo Gov.br, informe o nome e a data de nascimento.");
            }

            cidadao = registrar(
                    pedido.nome(),
                    cpf.digitos(),
                    pedido.dataNascimento(),
                    null,
                    null,
                    true
            );
        }

        return responder(
                acervo.abrirSessao(Canal.APP, cidadao.getId()),
                "gov.br",
                true
        );
    }

    public RespostaDeIdentificacao areaDaSessao(String token) {
        Sessao sessao = exigirSessao(token);
        return responder(sessao, null, null);
    }

    public void encerrar(String token) {
        if (!acervo.encerrarSessao(token)) {
            throw sessaoInvalida();
        }
    }

    public Cidadao registrar(
            String nome,
            String cpfBruto,
            LocalDate dataNascimento,
            String cartaoBruto,
            String senha,
            boolean govBr) {

        Cpf cpf = Cpf.analisar(cpfBruto);
        String cartao = null;

        if (preenchido(cartaoBruto)) {
            cartao = CartaoSus.analisar(cartaoBruto).digitos();
        }

        Credencial credencial;

        if (govBr && !preenchido(senha)) {
            credencial = Credencial.govBr();
        } else {
            credencial = Credencial.comSenha(SenhaHash.gerar(senha));
        }

        Cidadao cidadao = new Cidadao(
                acervo.proximoId(),
                nome.trim(),
                cpf.digitos(),
                cartao,
                dataNascimento
        );

        acervo.guardar(cidadao, credencial);
        return cidadao;
    }

    private Cidadao resolverTotem(
            boolean temCartao,
            boolean temCpf,
            Cidadao porCartao,
            Cidadao porCpf) {

        if (temCartao && temCpf) {
            if (porCartao == null || porCpf == null || !porCartao.getId().equals(porCpf.getId())) {
                throw naoEncontrado();
            }

            return porCartao;
        }

        if (temCartao) {
            if (porCartao == null) {
                throw naoEncontrado();
            }

            return porCartao;
        }

        if (porCpf == null) {
            throw naoEncontrado();
        }

        return porCpf;
    }

    private RespostaDeIdentificacao responder(Sessao sessao, String provedor, Boolean oauthSimulado) {
        return new RespostaDeIdentificacao(
                sessao.getToken(),
                sessao.getCanal().name(),
                provedor,
                oauthSimulado,
                areaPessoal.de(sessao.getCidadaoId())
        );
    }

    private Sessao exigirSessao(String token) {
        return acervo.buscarSessao(token).orElseThrow(ServicoDeIdentificacao::sessaoInvalida);
    }

    private static boolean preenchido(String valor) {
        return valor != null && !valor.isBlank();
    }

    private static ApiException dados(String mensagem) {
        return new ApiException(400, "DADOS_INVALIDOS", mensagem);
    }

    private static ApiException naoEncontrado() {
        return new ApiException(
                404,
                "CIDADAO_NAO_ENCONTRADO",
                "Não encontramos um cadastro com esses dados. Confira o número ou peça ajuda no balcão."
        );
    }

    private static ApiException senhaNaoConfere() {
        return new ApiException(
                401,
                "SENHA_INCORRETA",
                "CPF ou senha não conferem. Tente de novo."
        );
    }

    private static ApiException sessaoInvalida() {
        return new ApiException(
                401,
                "SESSAO_INVALIDA",
                "Não há sessão ativa. Identifique-se de novo."
        );
    }
}
