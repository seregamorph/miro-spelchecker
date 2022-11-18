package com.miro.spelchecker.dto;

import lombok.Getter;
import lombok.Setter;
import org.languagetool.rules.RuleMatch;


import java.util.List;

@Getter
@Setter
public class SpelCheckResponseElement {
    private String elementId;
    private int fromPos;
    private int toPos;
    private String message;
    private List<String> suggestedReplacements;

    public SpelCheckResponseElement(RuleMatch match){
        this.setFromPos(match.getFromPos());
        this.setToPos(match.getToPos());
        this.setMessage(match.getMessage());
        this.setSuggestedReplacements(match.getSuggestedReplacements());
    }

    public SpelCheckResponseElement(String elementId, RuleMatch match){
        this(match);
        this.setElementId(elementId);
    }

}
