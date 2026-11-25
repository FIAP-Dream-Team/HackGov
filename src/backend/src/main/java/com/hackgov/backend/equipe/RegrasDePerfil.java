package com.hackgov.backend.equipe;

import com.hackgov.backend.api.ApiException;
import com.hackgov.backend.domain.PerfilUsuario;
import com.hackgov.backend.domain.UsuarioInstitucional;

/**
 * Segregação de funções no canal da equipe: quem executa não encerra.
 *
 * <ul>
 *   <li>ATENDENTE opera a fila: libera o agendamento, chama a senha e
 *   registra a falta.</li>
 *   <li>GESTOR acompanha a fila e os indicadores e é quem conclui o
 *   encaminhamento, depois de conferir o que o atendente registrou.</li>
 * </ul>
 *
 * Os dois veem a mesma fila; o que muda é o que cada um pode alterar.
 */
public final class RegrasDePerfil {

    private RegrasDePerfil() {
    }

    public static void exigirAtendente(UsuarioInstitucional usuario) {
        if (usuario.getPerfil() != PerfilUsuario.ATENDENTE) {
            throw new ApiException(
                    403,
                    "ACESSO_NEGADO",
                    "Esta ação é do atendente. O gestor acompanha a fila e conclui os encaminhamentos."
            );
        }
    }

    public static void exigirGestor(UsuarioInstitucional usuario) {
        if (usuario.getPerfil() != PerfilUsuario.GESTOR) {
            throw new ApiException(
                    403,
                    "ACESSO_NEGADO",
                    "Concluir um encaminhamento é do gestor da unidade."
            );
        }
    }
}
