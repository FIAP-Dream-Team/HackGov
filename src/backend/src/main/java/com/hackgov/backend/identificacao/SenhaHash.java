package com.hackgov.backend.identificacao;

import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.security.spec.KeySpec;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

public final class SenhaHash {

    private static final int ITERACOES = 65536;
    private static final int BYTES_DO_SAL = 16;
    private static final int BITS_DA_CHAVE = 256;

    private final byte[] sal;
    private final byte[] hash;

    private SenhaHash(byte[] sal, byte[] hash) {
        this.sal = sal;
        this.hash = hash;
    }

    public static SenhaHash gerar(String senha) {
        if (senha == null || senha.length() < 8) {
            throw new IllegalArgumentException(
                    "A senha precisa ter pelo menos 8 caracteres."
            );
        }

        byte[] sal = new byte[BYTES_DO_SAL];
        new SecureRandom().nextBytes(sal);
        return new SenhaHash(sal, derivar(senha, sal));
    }

    public boolean confere(String senha) {
        if (senha == null) {
            return false;
        }

        return MessageDigest.isEqual(hash, derivar(senha, sal));
    }

    private static byte[] derivar(String senha, byte[] sal) {
        KeySpec spec = new PBEKeySpec(
                senha.toCharArray(),
                sal,
                ITERACOES,
                BITS_DA_CHAVE
        );

        try {
            SecretKeyFactory fabrica = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
            byte[] hash = fabrica.generateSecret(spec).getEncoded();
            ((PBEKeySpec) spec).clearPassword();
            return hash;
        } catch (GeneralSecurityException erro) {
            throw new IllegalStateException("Não foi possível proteger a senha.", erro);
        }
    }
}
