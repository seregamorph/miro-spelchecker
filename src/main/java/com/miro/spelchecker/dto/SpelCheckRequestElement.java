package com.miro.spelchecker.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SpelCheckRequestElement {
    private String elementId;
    private String text;
}
