package com.hackgov.backend.domain;

/**
 * Next team action for one referral. It is derived, not stored.
 * Phase 1 also names "buscar resultado"; the logical model has no
 * source for that action, so it is not a value here.
 */
public enum AcaoPendente {

    COBRAR_MARCACAO("Cobrar marcação"),
    REAGENDAR("Reagendar");

    private final String rotulo;

    AcaoPendente(String rotulo) {
        this.rotulo = rotulo;
    }

    public String getRotulo() {
        return rotulo;
    }
}
