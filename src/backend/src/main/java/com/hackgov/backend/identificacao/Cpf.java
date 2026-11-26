package com.hackgov.backend.identificacao;

public final class Cpf {

    private final String digitos;

    private Cpf(String digitos) {
        this.digitos = digitos;
    }

    public static Cpf analisar(String bruto) {
        if (bruto == null || bruto.isBlank()) {
            throw new IllegalArgumentException("Informe o CPF.");
        }

        String digitos = soDigitos(bruto);

        if (digitos == null || digitos.length() != 11) {
            throw new IllegalArgumentException(
                    "O CPF precisa ter 11 números."
            );
        }

        if (todosIguais(digitos) || !digitoConfere(digitos)) {
            throw new IllegalArgumentException(
                    "O CPF informado não é válido. Confira os números e tente de novo."
            );
        }

        return new Cpf(digitos);
    }

    public String digitos() {
        return digitos;
    }

    private static boolean digitoConfere(String digitos) {
        int primeiro = digito(digitos, 9, 10);
        int segundo = digito(digitos, 10, 11);
        return primeiro == caractere(digitos, 9)
                && segundo == caractere(digitos, 10);
    }

    private static int digito(String digitos, int quantidade, int pesoInicial) {
        int soma = 0;

        for (int i = 0; i < quantidade; i++) {
            soma += caractere(digitos, i) * (pesoInicial - i);
        }

        int resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }

    private static boolean todosIguais(String digitos) {
        char primeiro = digitos.charAt(0);

        for (int i = 1; i < digitos.length(); i++) {
            if (digitos.charAt(i) != primeiro) {
                return false;
            }
        }

        return true;
    }

    private static int caractere(String digitos, int posicao) {
        return digitos.charAt(posicao) - '0';
    }

    static String soDigitos(String bruto) {
        StringBuilder saida = new StringBuilder();

        for (int i = 0; i < bruto.length(); i++) {
            char caractere = bruto.charAt(i);

            if (caractere >= '0' && caractere <= '9') {
                saida.append(caractere);
                continue;
            }

            if (caractere == '.' || caractere == '-' || caractere == '/' || caractere == ' ') {
                continue;
            }

            return null;
        }

        return saida.toString();
    }
}
