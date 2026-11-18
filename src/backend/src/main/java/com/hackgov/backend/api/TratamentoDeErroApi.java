package com.hackgov.backend.api;

import com.hackgov.backend.memoria.ConflitoDeCadastro;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class TratamentoDeErroApi {

    private static final Logger log = LoggerFactory.getLogger(TratamentoDeErroApi.class);

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErroApi> tratar(ApiException erro) {
        return ResponseEntity
                .status(erro.getStatus())
                .body(new ErroApi(erro.getCodigo(), erro.getMessage()));
    }

    @ExceptionHandler(ConflitoDeCadastro.class)
    public ResponseEntity<ErroApi> tratar(ConflitoDeCadastro erro) {
        return ResponseEntity
                .status(409)
                .body(new ErroApi(erro.getCodigo(), erro.getMessage()));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErroApi> corpoIlegivel() {
        return ResponseEntity
                .badRequest()
                .body(new ErroApi(
                        "DADOS_INVALIDOS",
                        "Não foi possível ler os dados enviados. Confira o formato e tente de novo."
                ));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErroApi> argumentoInvalido(IllegalArgumentException erro) {
        return ResponseEntity
                .badRequest()
                .body(new ErroApi("DADOS_INVALIDOS", erro.getMessage()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErroApi> regraViolada(IllegalStateException erro) {
        return ResponseEntity
                .status(409)
                .body(new ErroApi("REGRA_VIOLADA", erro.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroApi> inesperado(Exception erro) {
        log.error("Unexpected API failure", erro);
        return ResponseEntity
                .status(500)
                .body(new ErroApi(
                        "FALHA_INTERNA",
                        "Não foi possível concluir agora. Tente de novo ou peça ajuda no balcão."
                ));
    }
}
