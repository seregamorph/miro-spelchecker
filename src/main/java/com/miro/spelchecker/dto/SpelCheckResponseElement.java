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
    private int indexShiftStart;
    private int indexShiftEnd;

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

    public SpelCheckResponseElement(String elementId, RuleMatch match, int indexShiftStart, String plainText, int indexShiftEnd){
        this(match);
        this.setElementId(elementId);
        this.indexShiftStart = indexShiftStart;
        this.indexShiftEnd = indexShiftEnd;
        this.plainText = plainText;
    }

    public int getFromPos() {
        return fromPosPlain + indexShiftStart - 1;
    }

    public int getToPos() {
        return toPosPlain + indexShiftStart + indexShiftEnd - 1 ;
    }
}
