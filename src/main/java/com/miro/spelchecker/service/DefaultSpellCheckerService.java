package com.miro.spelchecker.service;

import com.miro.spelchecker.controller.JsoupHelper;
import com.miro.spelchecker.dto.LanguageToolFactory;
import com.miro.spelchecker.dto.SpelCheckRequestElement;
import com.miro.spelchecker.dto.SpelCheckResponseElement;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.TextNode;
import org.jsoup.parser.Parser;
import org.languagetool.JLanguageTool;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.*;

@Service
public class DefaultSpellCheckerService implements SpellCheckerService {

    private static final String[] charsToBeEncoded = new String[]{":", "/", "?", "#", "[", "]", "@", "!", "$", "&", "'", "(", ")", "*", "+", ",", ";", "="};

    private static long countNumberOfOccurrences(String inputStr, String[] items) {
        return Arrays.stream(items).filter(inputStr::contains).count();
    }

    @Override
    public List<SpelCheckResponseElement> spellCheck(String language, SpelCheckRequestElement element) throws IOException {
        JLanguageTool langTool = LanguageToolFactory.getLanguageTool(language);
        langTool.activateLanguageModelRules(new File("/data/google-ngram-data"));

        Parser parser = Parser.htmlParser().setTrackPosition(true);
        Document doc = Jsoup.parse(element.getText(), parser);

        List<SpelCheckResponseElement> responseMatches = new ArrayList<>();
        var indexMapping = new HashMap<Integer, TextNode>();

        // Jsoup parses the dom tree into nodes, all nodes that contain text are textnodes.
        // indexMapping map stores <start position of the text node within plain text, textNode>
        // textNodes know their start positions in the original input.
        // with the help of indexmapping, we can calculate the error position in the original input.
        String plainText = JsoupHelper.getPlainText(doc, indexMapping);
        var matches = langTool.check(plainText);

        matches.forEach(match ->
        {
            int fromPosPlain = match.getFromPos();
            int toPosPlain = match.getToPos();

            //Calculate how much index changes: find the textnode that this match is contained in.
            //calculate the difference between its start index in the plaintext vs in the original html.

            var startNodeKey = indexMapping.keySet().stream().filter(key -> key <= match.getFromPos()).sorted(Collections.reverseOrder()).findFirst().get();
            var startTextNode = indexMapping.get(startNodeKey);
            int countOfEncodedCharactersBeforeMatchPosition = (int) countNumberOfOccurrences(plainText.substring(startNodeKey, match.getFromPos()), charsToBeEncoded);
            int fromPos = match.getFromPos() + getTextNodeStartPosition(startTextNode) - startNodeKey + (countOfEncodedCharactersBeforeMatchPosition) * 4;


            var endNodeKey = indexMapping.keySet().stream().filter(key -> key <= match.getToPos()).sorted(Collections.reverseOrder()).findFirst().get();
            var remainingLengthInEndNode = match.getToPos() - endNodeKey;
            var endTextNode = indexMapping.get(endNodeKey);
            int countOfEncodedCharactersInTheLastTextNode = (int) countNumberOfOccurrences(endTextNode.text().substring(0, remainingLengthInEndNode), charsToBeEncoded);
            int toPos = getTextNodeStartPosition(endTextNode) + countOfEncodedCharactersInTheLastTextNode * 4 + remainingLengthInEndNode;

            responseMatches.add(new SpelCheckResponseElement(element.getElementId(), plainText, fromPosPlain, toPosPlain, fromPos, toPos, match.getMessage(), match.getSuggestedReplacements()));

        });
        return responseMatches;
    }

    private int getTextNodeStartPosition(TextNode startTextNode) {
        // for the initial position jsoup returns -1 instead of 0.
        return startTextNode.sourceRange().start().pos() < 0 ? 0 : startTextNode.sourceRange().start().pos();
    }

}
