//package com.jalsoochak.apigateway.routes;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;
//import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.function.RouterFunction;
//import org.springframework.web.servlet.function.ServerResponse;
//
//import static org.springframework.cloud.gateway.server.mvc.predicate.GatewayRequestPredicates.path;
//
//@Configuration
//public class BfmReadingServiceRoute {
//
//    @Bean
//    public RouterFunction<ServerResponse> bfmReadingRoutes() {
//        return GatewayRouterFunctions.route()
//                .route(
//                        path("/api/readings/**"),
//                        HandlerFunctions.http("lb://bfm-reading-service")
//                )
//                .build();
//    }
//}