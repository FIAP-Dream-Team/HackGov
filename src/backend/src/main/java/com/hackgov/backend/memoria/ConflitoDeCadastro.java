package com.hackgov.backend.memoria;

public class ConflitoDeCadastro extends RuntimeException {

    private final String codigo;

    public ConflitoDeCadastro(String codigo, String mensagem) {
        super(mensagem);
        this.codigo = codigo;
    }

    public String getCodigo() {
        return codigo;
    }
}
