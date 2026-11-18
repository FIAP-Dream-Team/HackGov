package com.hackgov.backend.domain;

/**
 * Próxima ação da equipe para um encaminhamento. É derivada, não gravada.
 * A Fase 1 também cita "buscar resultado"; o modelo lógico não tem fonte
 * para essa ação, então ela não é um valor aqui.
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
