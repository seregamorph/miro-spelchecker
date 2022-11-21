package com.miro.spelchecker.dto;

import lombok.Getter;
import org.languagetool.markup.AnnotatedText;

@Getter
public class SpelCheckRequestElement {
    private String elementId;
    private String text;
}
