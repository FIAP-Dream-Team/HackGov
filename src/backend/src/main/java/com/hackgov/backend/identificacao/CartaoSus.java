package com.hackgov.backend.identificacao;

/**
 * Dígitos verificadores do Cartão Nacional de Saúde, pela rotina do DATASUS
 * publicada pela ANVISA: cartão definitivo começa com 1 ou 2, provisório
 * começa com 7, 8 ou 9.
 */
public final class CartaoSus {

    private final String digitos;

    private CartaoSus(String digitos) {
        this.digitos = digitos;
    }

    public static CartaoSus analisar(String bruto) {
        if (bruto == null || bruto.isBlank()) {
            throw new IllegalArgumentException("Informe o Cartão SUS.");
        }

        String digitos = Cpf.soDigitos(bruto);

        if (digitos == null || digitos.length() != 15) {
            throw new IllegalArgumentException(
                    "O Cartão SUS precisa ter 15 números."
            );
        }

        if (!confere(digitos)) {
            throw new IllegalArgumentException(
                    "O Cartão SUS informado não é válido. Confira os números e tente de novo."
            );
        }

        return new CartaoSus(digitos);
    }

    public String digitos() {
        return digitos;
    }

    private static boolean confere(String digitos) {
        char inicio = digitos.charAt(0);

        if (inicio == '1' || inicio == '2') {
            return definitivo(digitos);
        }

        if (inicio == '7' || inicio == '8' || inicio == '9') {
            return provisoria(digitos);
        }

        return false;
    }

    private static boolean definitivo(String digitos) {
        String base = digitos.substring(0, 11);
        int soma = somaPonderada(base, 15);
        int dv = 11 - (soma % 11);

        if (dv == 11) {
            dv = 0;
        }

        String esperado;

        if (dv == 10) {
            int resto = (soma + 2) % 11;
            int ajustado = 11 - resto;

            if (ajustado == 11) {
                ajustado = 0;
            }

            esperado = base + "001" + ajustado;
        } else {
            esperado = base + "000" + dv;
        }

        return digitos.equals(esperado);
    }

    private static boolean provisoria(String digitos) {
        return somaPonderada(digitos, 15) % 11 == 0;
    }

    private static int somaPonderada(String digitos, int pesoInicial) {
        int soma = 0;

        for (int i = 0; i < digitos.length(); i++) {
            soma += (digitos.charAt(i) - '0') * (pesoInicial - i);
        }

        return soma;
    }
}
