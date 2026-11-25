package com.hackgov.backend.identificacao;

import com.hackgov.backend.api.ApiException;
import com.hackgov.backend.memoria.AcervoMinhaVez;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

/**
 * Proteção contra chute de senha (força bruta). Cada forma de entrar tem a sua
 * chave: "app:" + CPF, "totem:" + documento e "equipe:" + login. Depois de
 * {@link AcervoMinhaVez#MAXIMO_DE_TENTATIVAS} erros seguidos, a chave fica
 * bloqueada por {@link AcervoMinhaVez#BLOQUEIO}, mesmo com a senha certa.
 */
public final class LimiteDeTentativas {

    private LimiteDeTentativas() {
    }

    public static String chaveApp(String cpf) {
        return "app:" + cpf;
    }

    public static String chaveTotem(String documento) {
        return "totem:" + documento;
    }

    public static String chaveEquipe(String login) {
        return "equipe:" + login.toLowerCase();
    }

    /** Recusa a tentativa enquanto a chave estiver bloqueada. */
    public static void verificar(AcervoMinhaVez acervo, String chave) {
        Optional<Instant> bloqueio = acervo.bloqueioDe(chave);

        if (bloqueio.isPresent()) {
            long segundos = Duration.between(acervo.agora(), bloqueio.get()).toSeconds();
            long minutos = Math.max(1, (segundos + 59) / 60);
            throw new ApiException(
                    429,
                    "MUITAS_TENTATIVAS",
                    "Muitas tentativas erradas seguidas. Por segurança, o acesso fica bloqueado por "
                            + minutos + (minutos == 1 ? " minuto." : " minutos.")
            );
        }
    }
}
