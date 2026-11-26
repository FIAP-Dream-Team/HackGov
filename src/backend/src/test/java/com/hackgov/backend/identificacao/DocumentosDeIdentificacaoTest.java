package com.hackgov.backend.identificacao;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DocumentosDeIdentificacaoTest {

    @Test
    void cpfComMascaraEDigitoValidoEntra() {
        assertEquals("52998224725", Cpf.analisar("529.982.247-25").digitos());
    }

    @Test
    void cpfInvalidoOuCurtoEhRecusado() {
        assertThrows(IllegalArgumentException.class, () -> Cpf.analisar("111.111.111-11"));
        assertThrows(IllegalArgumentException.class, () -> Cpf.analisar("12345678900"));
        assertThrows(IllegalArgumentException.class, () -> Cpf.analisar("123"));
    }

    @Test
    void cartaoSusDefinitivoEProvisorioEntram() {
        assertEquals("100000000060018", CartaoSus.analisar("100 0000 0006 0018").digitos());
        assertEquals("700000000000005", CartaoSus.analisar("700000000000005").digitos());
    }

    @Test
    void cartaoSusComDigitoErradoEhRecusado() {
        assertThrows(IllegalArgumentException.class, () -> CartaoSus.analisar("123456789010001"));
        assertThrows(IllegalArgumentException.class, () -> CartaoSus.analisar("000000000000000"));
    }

    @Test
    void senhaConfereSoComOTextoOriginal() {
        SenhaHash senha = SenhaHash.gerar("minhavez");

        assertTrue(senha.confere("minhavez"));
        assertFalse(senha.confere("outra-senha"));
    }
}
