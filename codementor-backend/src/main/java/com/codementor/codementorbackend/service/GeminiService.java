package com.codementor.codementorbackend.service;

import com.codementor.codementorbackend.dto.ErrorExplanation;
import com.codementor.codementorbackend.dto.ErrorRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api-key}")
    private String apiKey;

    private final RestClient restClient = RestClient.create();

    public ErrorExplanation explainError(ErrorRequest request) {

        String prompt = """
                You are CodeMentor AI, a programming error explanation assistant.

                The user has provided a programming error.

                Explain the error for a beginner.

                IMPORTANT RULES:

                1. Explain the error in the requested target language.
                2. Keep programming keywords such as String, int, class, method, variable,
                   Integer.parseInt(), etc. in English.
                3. Do not translate programming keywords.
                4. Keep the explanation simple and beginner-friendly.
                5. Do not use unnecessary technical jargon.
                6. Provide a small and clear code example.

                Return the answer using exactly these four sections:

                EXPLANATION:
                Explain what the error means.

                WHY_IT_HAPPENED:
                Explain why this error occurred.

                HOW_TO_FIX:
                Explain how the programmer can fix it.

                EXAMPLE:
                Give a short incorrect example and a corrected example.

                Programming Language:
                %s

                Target Language:
                %s

                Error:
                %s
                """.formatted(
                request.getLanguage(),
                request.getTargetLanguage(),
                request.getError()
        );

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt)
                                )
                        )
                )
        );

        Map<String, Object> response;

        try {

            response = restClient.post()
                    .uri("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent")
                    .header("x-goog-api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

        } catch (Exception e) {

            return new ErrorExplanation(
                    "The AI service is temporarily unavailable.",
                    "Gemini could not process the request right now.",
                    "Please wait a moment and try again.",
                    "No example is available because the AI service is currently unavailable."
            );
        }

        String responseText = extractText(response);

        return parseResponse(responseText);
    }

    private String extractText(Map<String, Object> response) {

        List<Map<String, Object>> candidates =
                (List<Map<String, Object>>) response.get("candidates");

        if (candidates == null || candidates.isEmpty()) {
            return "EXPLANATION:\nGemini did not return an explanation.\n\n"
                    + "WHY_IT_HAPPENED:\nNo explanation was returned.\n\n"
                    + "HOW_TO_FIX:\nPlease try again.\n\n"
                    + "EXAMPLE:\nNo example is available.";
        }

        Map<String, Object> content =
                (Map<String, Object>) candidates.get(0).get("content");

        if (content == null) {
            return "EXPLANATION:\nGemini returned an empty response.\n\n"
                    + "WHY_IT_HAPPENED:\nNo content was returned.\n\n"
                    + "HOW_TO_FIX:\nPlease try again.\n\n"
                    + "EXAMPLE:\nNo example is available.";
        }

        List<Map<String, Object>> parts =
                (List<Map<String, Object>>) content.get("parts");

        if (parts == null || parts.isEmpty()) {
            return "EXPLANATION:\nGemini returned an empty response.\n\n"
                    + "WHY_IT_HAPPENED:\nNo content was returned.\n\n"
                    + "HOW_TO_FIX:\nPlease try again.\n\n"
                    + "EXAMPLE:\nNo example is available.";
        }

        Object text = parts.get(0).get("text");

        if (text == null) {
            return "EXPLANATION:\nGemini returned no text.\n\n"
                    + "WHY_IT_HAPPENED:\nThe AI response did not contain text.\n\n"
                    + "HOW_TO_FIX:\nPlease try again.\n\n"
                    + "EXAMPLE:\nNo example is available.";
        }

        return text.toString();
    }

    private ErrorExplanation parseResponse(String response) {

        String explanation = extractSection(
                response,
                "EXPLANATION:",
                "WHY_IT_HAPPENED:"
        );

        String whyItHappened = extractSection(
                response,
                "WHY_IT_HAPPENED:",
                "HOW_TO_FIX:"
        );

        String howToFix = extractSection(
                response,
                "HOW_TO_FIX:",
                "EXAMPLE:"
        );

        String example = extractSection(
                response,
                "EXAMPLE:",
                null
        );

        return new ErrorExplanation(
                explanation,
                whyItHappened,
                howToFix,
                example
        );
    }

    private String extractSection(
            String response,
            String startMarker,
            String endMarker) {

        int start = response.indexOf(startMarker);

        if (start == -1) {
            return "";
        }

        start = start + startMarker.length();

        int end;

        if (endMarker != null) {
            end = response.indexOf(endMarker, start);
        } else {
            end = response.length();
        }

        if (end == -1) {
            end = response.length();
        }

        return response.substring(start, end).trim();
    }
}