package com.jalsoochak.ManagementService.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
//@SecuritySchemes({
//        @SecurityScheme(
//                name = "bearerToken",
//                type = SecuritySchemeType.HTTP,
//                scheme = "bearer",
//                bearerFormat = "JWT")
//})
@OpenAPIDefinition(
        info = @Info(title = "Management Service API", version = "v1"),
        servers = {
                @Server(url = "http://localhost:8086/", description = "Local Server")
        }
)
public class SwaggerConfig {
}
