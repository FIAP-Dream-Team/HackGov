package com.hackgov.backend.equipe;

/** Login da equipe. `perfil` diz ao front o que mostrar: ATENDENTE opera a fila, GESTOR acompanha e conclui. */
public record RespostaLoginEquipe(String token, String canal, String perfil) {
}
