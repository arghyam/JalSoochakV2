package com.jalsoochak.messaging_orchestrator_service.services;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class GlificService {

    private final GlificGraphqlClient client;
    private final String welcomeTemplateId;

    public GlificService(
            GlificGraphqlClient client,
            @Value("${glific.welcome-template-id}") String welcomeTemplateId
    ) {
        this.client = client;
        this.welcomeTemplateId = welcomeTemplateId;
    }

    public Long createContact(String name, String phone) {

        String query = """
            mutation createContact($input: ContactInput!) {
              createContact(input: $input) {
                contact { id }
                errors { key message }
              }
            }
        """;

        JsonNode response = client.execute(query, Map.of(
                "input", Map.of("name", name, "phone", phone)
        ));

        return response.path("data")
                .path("createContact")
                .path("contact")
                .path("id")
                .asLong();
    }

    public void optIn(String phone) {

        String query = """
            mutation optinContact($phone: String!) {
              optinContact(phone: $phone) {
                contact { id }
                errors { key message }
              }
            }
        """;

        client.execute(query, Map.of("phone", phone));
    }


    public void sendWelcomeHsm(Long receiverId) {

        String query = """
            mutation sendHsmMessage(
              $templateId: ID!,
              $receiverId: ID!,
              $parameters: [String]
            ) {
              sendHsmMessage(
                templateId: $templateId,
                receiverId: $receiverId,
                parameters: $parameters
              ) {
                message { id body isHSM }
                errors { key message }
              }
            }
        """;

        client.execute(query, Map.of(
                "templateId", welcomeTemplateId,
                "receiverId", receiverId,
                "parameters", List.of()
        ));
    }
}

