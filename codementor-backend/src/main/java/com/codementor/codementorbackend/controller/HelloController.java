package com.codementor.codementorbackend.controller;
import com.codementor.codementorbackend.dto.ErrorExplanation;
import com.codementor.codementorbackend.dto.ErrorRequest;
import com.codementor.codementorbackend.service.GeminiService;
import org.springframework.web.bind.annotation.*;

@RestController
public class HelloController {

    private final GeminiService geminiService;

    public HelloController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @GetMapping("/api/hello")
    public String hello() {
        return "Hello from CodeMentor AI!";
    }

  @PostMapping("/api/errors/explain")
public ErrorExplanation explainError(@RequestBody ErrorRequest request) {

    return geminiService.explainError(request);
}

}