package com.miro.spelchecker.dto;

import lombok.Getter;
import lombok.Setter;
import org.languagetool.rules.RuleMatch;


import java.util.List;

@Getter
@Setter
public class SpelCheckResponseElement {
    private String elementId;
    private String plainText;
    private int fromPosPlain;
    private int toPosPlain;
    private String message;
    private List<String> suggestedReplacements;
    private int indexShift;

    public SpelCheckResponseElement(RuleMatch match){
        this.setFromPosPlain(match.getFromPos());
        this.setToPosPlain(match.getToPos());
        this.setMessage(match.getMessage());
        if (match.getSuggestedReplacements().stream().count() > 5) {
            this.setSuggestedReplacements(match.getSuggestedReplacements().subList(0,5));
        } else {
            this.setSuggestedReplacements(match.getSuggestedReplacements());
        }
    }

    public SpelCheckResponseElement(String elementId, RuleMatch match, int indexShift, String plainText){
        this(match);
        this.setElementId(elementId);
        this.indexShift = indexShift;
        this.plainText = plainText;
    }

    public int getFromPos() {
        return fromPosPlain + indexShift - 1;
    }

    public int getToPos() {
        return toPosPlain + indexShift - 1 ;
    }
}
