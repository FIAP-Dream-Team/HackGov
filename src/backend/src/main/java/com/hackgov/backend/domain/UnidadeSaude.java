package com.hackgov.backend.domain;

public class UnidadeSaude {

    private Long id;
    private String nome;
    private TipoUnidade tipo;
    private String cnes;
    private String logradouro;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String uf;
    private String cep;

    public UnidadeSaude(
            Long id,
            String nome,
            TipoUnidade tipo,
            String cnes,
            String logradouro,
            String numero,
            String complemento,
            String bairro,
            String cidade,
            String uf,
            String cep) {

        if (tipo == null) {
            throw new IllegalArgumentException(
                    "O tipo da unidade é obrigatório."
            );
        }

        this.id = id;
        this.nome = exigir(nome, "O nome da unidade é obrigatório.");
        this.tipo = tipo;
        this.cnes = vazioComoNulo(cnes);
        this.logradouro = exigir(logradouro, "O logradouro é obrigatório.");
        this.numero = exigir(numero, "O número é obrigatório.");
        this.complemento = vazioComoNulo(complemento);
        this.bairro = exigir(bairro, "O bairro é obrigatório.");
        this.cidade = exigir(cidade, "A cidade é obrigatória.");
        this.uf = exigir(uf, "A UF é obrigatória.");
        this.cep = exigir(cep, "O CEP é obrigatório.");
    }

    private static String exigir(String valor, String mensagem) {

        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException(mensagem);
        }

        return valor;
    }

    private static String vazioComoNulo(String valor) {

        if (valor == null || valor.isBlank()) {
            return null;
        }

        return valor;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public TipoUnidade getTipo() {
        return tipo;
    }

    public String getCnes() {
        return cnes;
    }

    public String getLogradouro() {
        return logradouro;
    }

    public String getNumero() {
        return numero;
    }

    public String getComplemento() {
        return complemento;
    }

    public String getBairro() {
        return bairro;
    }

    public String getCidade() {
        return cidade;
    }

    public String getUf() {
        return uf;
    }

    public String getCep() {
        return cep;
    }

    @Override
    public boolean equals(Object outro) {

        if (this == outro) {
            return true;
        }

        if (!(outro instanceof UnidadeSaude)) {
            return false;
        }

        UnidadeSaude unidade = (UnidadeSaude) outro;

        return id != null && id.equals(unidade.id);
    }

    @Override
    public int hashCode() {
        return id == null ? 0 : id.hashCode();
    }
}
