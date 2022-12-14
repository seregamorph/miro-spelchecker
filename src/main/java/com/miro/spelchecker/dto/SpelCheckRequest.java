package com.miro.spelchecker.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class SpelCheckRequest {
    private String language;
    private List<SpelCheckRequestElement> elements;
}
