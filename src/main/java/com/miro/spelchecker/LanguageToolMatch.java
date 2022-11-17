package com.miro.spelchecker;

import lombok.Getter;
import lombok.Setter;
import org.languagetool.rules.RuleMatch;


import java.util.List;

@Getter
@Setter
public class LanguageToolMatch {
    private int fromPos;
    private int toPos;
    private String message;
    private List<String> suggestedReplacements;

    public LanguageToolMatch(RuleMatch match){
        this.setFromPos(match.getFromPos());
        this.setToPos(match.getToPos());
        this.setMessage(match.getMessage());
        this.setSuggestedReplacements(match.getSuggestedReplacements());
    }

}
