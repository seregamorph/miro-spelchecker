package com.miro.spelchecker.dto;

import lombok.Getter;
import lombok.Setter;
import org.jsoup.nodes.TextNode;
import org.languagetool.rules.RuleMatch;


import java.util.Arrays;
import java.util.List;

@Getter
@Setter
public class SpelCheckResponseElement {

    private static String[] charsToBeEncoded = new String[] {":", "/", "?", "#", "[", "]", "@", "!", "$", "&", "'", "(", ")", "*", "+", ",", ";", "="};

    private String elementId;
    private String plainText;
    private int fromPosPlain;
    private int toPosPlain;
    private String message;
    private List<String> suggestedReplacements;
    private TextNode textNode;
    private int indexShiftForStartPosition;
    private int indexShiftForEndPosition;


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

    public SpelCheckResponseElement(String elementId, RuleMatch match, String plainText, Integer plainTextStartIndex, TextNode textNode){
        this(match);
        this.setElementId(elementId);
        this.plainText = plainText;
        this.textNode = textNode;

        //Find number of html-encoded characters within the text node & before the error position.
        int countOfEncodedCharactersBeforeMatchPosition = (int) countNumberOfOccurrences(plainText.substring(plainTextStartIndex,match.getFromPos()), charsToBeEncoded);
        this.indexShiftForStartPosition = textNode.sourceRange().start().columnNumber() - plainTextStartIndex + (countOfEncodedCharactersBeforeMatchPosition)*4 ;

        int countOfEncodedCharactersInTheMatch = (int) countNumberOfOccurrences(plainText.substring(match.getFromPos(), match.getToPos()), charsToBeEncoded);
        this.indexShiftForEndPosition = indexShiftForStartPosition + countOfEncodedCharactersInTheMatch*4;
    }

    public int getFromPos() {
        return fromPosPlain + indexShiftForStartPosition - 1;
    }

    public int getToPos() {
        return toPosPlain + indexShiftForEndPosition - 1 ;
    }

    private static long countNumberOfOccurrences(String inputStr, String[] items) {
        return Arrays.stream(items).filter(inputStr::contains).count();
    }
}
