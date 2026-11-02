package com.codementor.codementorbackend.dto;

public class ErrorExplanation {

    private String explanation;
    private String whyItHappened;
    private String howToFix;
    private String example;

    public ErrorExplanation() {
    }

    public ErrorExplanation(
            String explanation,
            String whyItHappened,
            String howToFix,
            String example) {

        this.explanation = explanation;
        this.whyItHappened = whyItHappened;
        this.howToFix = howToFix;
        this.example = example;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public String getWhyItHappened() {
        return whyItHappened;
    }

    public void setWhyItHappened(String whyItHappened) {
        this.whyItHappened = whyItHappened;
    }

    public String getHowToFix() {
        return howToFix;
    }

    public void setHowToFix(String howToFix) {
        this.howToFix = howToFix;
    }

    public String getExample() {
        return example;
    }

    public void setExample(String example) {
        this.example = example;
    }
}