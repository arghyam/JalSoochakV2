package com.jalsoochak.water_supply_calculation_service.configs;

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
//@OpenAPIDefinition(
//        info = @Info(title = "Water Supply Calculation Service API", version = "v2"),
//        servers = {
//                @Server(url = "http://localhost:9100/api/v2/", description = "Local Server")
//        }
//)
@OpenAPIDefinition(
        info = @Info(
                title = "Water Supply Calculation Service API",
                version = "v2"
        )
)
public class SwaggerConfig {
}
