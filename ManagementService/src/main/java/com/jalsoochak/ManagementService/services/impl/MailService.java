package com.jalsoochak.ManagementService.services.impl;

import com.mailjet.client.MailjetClient;
import com.mailjet.client.MailjetRequest;
import com.mailjet.client.MailjetResponse;
import com.mailjet.client.resource.Emailv31;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class MailService {

    @Value("${mailjet.api-key}")
    private String apiKey;

    @Value("${mailjet.secret-key}")
    private String secretKey;

    @Value("${mailjet.from-email}")
    private String fromEmail;

    @Value("${mailjet.from-name}")
    private String fromName;

    public void sendInviteMail(String recipientEmail, String inviteLink) {
        try {

            MailjetClient client = new MailjetClient(apiKey, secretKey);

            JSONObject message = new JSONObject()
                    .put("From", new JSONObject()
                            .put("Email", fromEmail)
                            .put("Name", fromName))
                    .put("To", new JSONArray()
                            .put(new JSONObject().put("Email", recipientEmail)))
                    .put("Subject", "You're invited to join the platform")
                    .put("HTMLPart", """
                            <p>Hello,</p>
                            <p>You have been invited to join the Jalsoochak platform.</p>
                            <p>Click the button below to set your password:</p>
                            <p>
                              <a href="%s"
                                 style="background:#2563eb;color:white;
                                 padding:10px 16px;text-decoration:none;
                                 border-radius:6px;">
                                Set Password
                              </a>
                            </p>
                            <p>This link expires in 24 hours.</p>
                            """.formatted(inviteLink))
                    .put("TextPart", "Hello,\n\nYou have been invited to join the Jalsoochak platform.\n"
                            + "Click the link to set your password: " + inviteLink + "\n\nThis link expires in 24 hours.");

            MailjetRequest request = new MailjetRequest(Emailv31.resource)
                    .property(Emailv31.MESSAGES, new JSONArray().put(message));

            MailjetResponse response = client.post(request);

            log.info("Mailjet response status: {}", response.getStatus());
            log.info("Mailjet response data: {}", response.getData());

            JSONArray messages = response.getData();
            if (messages.length() > 0) {
                JSONObject firstMessage = messages.getJSONObject(0);
                String emailStatus = firstMessage.optString("Status", "unknown");
                if (!"success".equalsIgnoreCase(emailStatus)) {
                    log.warn("Email may not have been delivered. Status: {}", emailStatus);
                }
            }
        } catch (Exception e) {
            log.error("Failed to send invite email to {}", recipientEmail, e);
            throw new RuntimeException("Failed to send invite email", e);
        }
    }
}
