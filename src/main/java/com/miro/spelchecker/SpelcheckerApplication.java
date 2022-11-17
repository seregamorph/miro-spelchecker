package com.miro.spelchecker;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.boot.web.servlet.context.ServletWebServerInitializedEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
@Slf4j
@RequiredArgsConstructor
public class SpelcheckerApplication {

    private final ServerProperties serverProperties;

    @EventListener
    public void onApplicationEvent(ServletWebServerInitializedEvent event) {
        val protocol = serverProperties.getSsl() != null && serverProperties.getSsl().isEnabled() ? "https" : "http";
        if ("management".equals(event.getApplicationContext().getServerNamespace())) {
            log.info("Management server started at {}://localhost:{}/manage", protocol, event.getWebServer().getPort());
        } else {
            log.info("Server started at {}://localhost:{}", protocol, event.getWebServer().getPort());
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(SpelcheckerApplication.class, args);
    }
}
