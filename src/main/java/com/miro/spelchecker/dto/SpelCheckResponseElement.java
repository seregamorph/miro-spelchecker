package com.miro.spelchecker.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class SpelCheckResponseElement {

    private String elementId;
    private String plainText;
    private int fromPosPlain;
    private int toPosPlain;
    private int fromPos;
    private int toPos;
    private String message;
    private List<String> suggestedReplacements;

}
