package com.hackgov.backend.identificacao;

public final class Credencial {

    private final SenhaHash senha;
    private final boolean govBr;

    private Credencial(SenhaHash senha, boolean govBr) {
        this.senha = senha;
        this.govBr = govBr;
    }

    public static Credencial comSenha(SenhaHash senha) {
        if (senha == null) {
            throw new IllegalArgumentException("A senha é obrigatória.");
        }

        return new Credencial(senha, false);
    }

    public static Credencial govBr() {
        return new Credencial(null, true);
    }

    public boolean temSenha() {
        return senha != null;
    }

    public SenhaHash getSenha() {
        return senha;
    }

    public boolean isGovBr() {
        return govBr;
    }
}
