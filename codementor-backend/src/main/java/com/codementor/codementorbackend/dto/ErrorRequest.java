package com.codementor.codementorbackend.dto;

public class ErrorRequest {

    private String error;
    private String language;
    private String targetLanguage;

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getTargetLanguage() {
        return targetLanguage;
    }

    public void setTargetLanguage(String targetLanguage) {
        this.targetLanguage = targetLanguage;
    }
}