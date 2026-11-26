package com.hackgov.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Proteção contra clickjacking: nenhuma resposta do servidor pode ser aberta
 * dentro de um iframe de outro site (nem do próprio). Sem isso, uma página
 * maliciosa poderia carregar o sistema invisível por cima de um botão e fazer
 * a pessoa clicar sem saber.
 *
 * Dois cabeçalhos, porque cada navegador entende um: X-Frame-Options (o
 * antigo, que todos conhecem) e a diretiva frame-ancestors da CSP (o padrão
 * atual, que tem prioridade nos navegadores novos).
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ProtecaoContraIframe extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest pedido,
            HttpServletResponse resposta,
            FilterChain cadeia) throws ServletException, IOException {

        resposta.setHeader("X-Frame-Options", "DENY");
        resposta.setHeader("Content-Security-Policy", "frame-ancestors 'none'");
        cadeia.doFilter(pedido, resposta);
    }
}
