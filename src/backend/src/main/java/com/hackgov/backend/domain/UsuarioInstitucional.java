package com.hackgov.backend.domain;

public class UsuarioInstitucional extends Pessoa {

    private String login;
    private PerfilUsuario perfil;
    private UnidadeSaude unidade;

    public UsuarioInstitucional(
            Long id,
            String nome,
            String login,
            PerfilUsuario perfil,
            UnidadeSaude unidade) {

        super(id, nome);

        if (login == null || login.isBlank()) {
            throw new IllegalArgumentException(
                    "O login é obrigatório."
            );
        }

        if (perfil == null) {
            throw new IllegalArgumentException(
                    "O perfil do usuário é obrigatório."
            );
        }

        if (unidade == null) {
            throw new IllegalArgumentException(
                    "A unidade de lotação é obrigatória."
            );
        }

        this.login = login;
        this.perfil = perfil;
        this.unidade = unidade;
    }

    public String getLogin() {
        return login;
    }

    public PerfilUsuario getPerfil() {
        return perfil;
    }

    public UnidadeSaude getUnidade() {
        return unidade;
    }

    public void autenticar() {
        System.out.println(
                "Usuário " + getNome()
                        + " autenticado como " + perfil
        );
    }

    public void atualizarEncaminhamento(
            Encaminhamento encaminhamento,
            StatusEncaminhamento novoStatus) {

        if (encaminhamento == null) {
            throw new IllegalArgumentException(
                    "O encaminhamento é obrigatório."
            );
        }

        if (novoStatus == StatusEncaminhamento.AGENDADO) {
            throw new IllegalStateException(
                    "O status AGENDADO é definido quando o cidadão confirma um horário."
            );
        }

        if (encaminhamento.getStatus() == StatusEncaminhamento.AGENDADO
                && novoStatus == StatusEncaminhamento.AGUARDANDO_AGENDAMENTO) {
            throw new IllegalStateException(
                    "Para voltar à fila, o agendamento precisa ser cancelado."
            );
        }

        encaminhamento.atualizarStatus(
                novoStatus,
                this
        );
    }

    public void consultarFila() {
        System.out.println(
                "Consultando fila de encaminhamentos..."
        );
    }
}