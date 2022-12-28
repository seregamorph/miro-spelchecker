package com.miro.spelchecker.service;

import com.miro.spelchecker.controller.JsoupHelper;
import com.miro.spelchecker.dto.LanguageToolFactory;
import com.miro.spelchecker.dto.SpelCheckRequestElement;
import com.miro.spelchecker.dto.SpelCheckResponseElement;
import org.apache.commons.lang3.StringUtils;
import org.jetbrains.annotations.NotNull;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.TextNode;
import org.jsoup.parser.Parser;
import org.languagetool.JLanguageTool;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class DefaultSpellCheckerService implements SpellCheckerService {

    private static final String[] charsToBeEncoded = new String[]{"&", "\""};
    private final Parser parser = Parser.htmlParser().setTrackPosition(true);

    @Override
    public List<SpelCheckResponseElement> spellCheck(String language, SpelCheckRequestElement element) throws IOException {
        JLanguageTool langTool = LanguageToolFactory.getLanguageTool(language);
        return spellCheck(langTool, element);
    }

    @Override
    public List<SpelCheckResponseElement> spellCheck(String language, List<SpelCheckRequestElement> elementList) throws IOException {
        JLanguageTool langTool = LanguageToolFactory.getLanguageTool(language);
        return elementList.stream().flatMap(element -> {
            try {
                return spellCheck(langTool, element).stream();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return Stream.empty();
        }).collect(Collectors.toList());
    }

    @NotNull
    private List<SpelCheckResponseElement> spellCheck(JLanguageTool langTool, SpelCheckRequestElement element ) throws IOException {
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

            int startNodeKey;
            var minTextIndex = indexMapping.keySet().stream().min(Comparator.naturalOrder());
            if (minTextIndex.get() > match.getFromPos()) {
                startNodeKey = minTextIndex.get();
            } else {
                startNodeKey = indexMapping.keySet().stream().filter(key -> key <= match.getFromPos()).max(Comparator.naturalOrder()).get();
            }
            var startTextNode = indexMapping.get(startNodeKey);
            int countOfEncodedCharactersBeforeMatchPosition = (int) countNumberOfOccurrences(plainText.substring(startNodeKey, Math.max(startNodeKey,match.getFromPos())), charsToBeEncoded);
            int numberOfNewLine = (int) countNumberOfOccurrences(plainText.substring(startNodeKey, Math.max(startNodeKey,match.getFromPos())), new String[] {"\n"});
            int fromPos = match.getFromPos() + getTextNodeStartPosition(startTextNode) - Math.min(startNodeKey,match.getFromPos()) + (countOfEncodedCharactersBeforeMatchPosition) * 4 + numberOfNewLine;


            var endNodeKey = indexMapping.keySet().stream().filter(key -> key <= match.getToPos()).max(Comparator.naturalOrder()).get();
            var remainingLengthInEndNode = match.getToPos() - endNodeKey;
            var endTextNode = indexMapping.get(endNodeKey);
            int countOfEncodedCharactersInTheLastTextNode = (int) countNumberOfOccurrences(endTextNode.text().substring(0, remainingLengthInEndNode), charsToBeEncoded);
            int toPos = getTextNodeStartPosition(endTextNode) + countOfEncodedCharactersInTheLastTextNode * 4 + remainingLengthInEndNode;

            responseMatches.add(new SpelCheckResponseElement(element.getElementId(), plainText, fromPosPlain, toPosPlain, fromPos, toPos, match.getMessage(), match.getSuggestedReplacements()));

        });
        return responseMatches;
    }

    private static long countNumberOfOccurrences(String inputStr, String[] items) {
        return Arrays.stream(items).map(item -> StringUtils.countMatches(inputStr, item)).reduce(0, Integer::sum);

    }

    private int getTextNodeStartPosition(TextNode startTextNode) {
        // for the initial position jsoup returns -1 instead of 0.
        return Math.max(startTextNode.sourceRange().start().pos(), 0);
    }

}
