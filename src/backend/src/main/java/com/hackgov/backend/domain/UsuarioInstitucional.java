package com.hackgov.backend.domain;

public class UsuarioInstitucional extends Pessoa {

    private String login;
    private PerfilUsuario perfil;

    public UsuarioInstitucional(
            Long id,
            String nome,
            String login,
            PerfilUsuario perfil) {

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

        this.login = login;
        this.perfil = perfil;
    }

    public String getLogin() {
        return login;
    }

    public PerfilUsuario getPerfil() {
        return perfil;
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