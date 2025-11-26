package com.jalsoochak.servicediscoveryserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class ServicediscoveryserverApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServicediscoveryserverApplication.class, args);
	}

}
