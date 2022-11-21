package com.miro.spelchecker.controller;

import com.miro.spelchecker.dto.LanguageFactory;
import com.miro.spelchecker.dto.SpelCheckRequest;
import com.miro.spelchecker.dto.SpelCheckResponseElement;
import org.jsoup.Jsoup;
import org.jsoup.nodes.*;
import org.jsoup.parser.Parser;
import org.jsoup.parser.Tag;
import org.languagetool.JLanguageTool;
import org.languagetool.markup.AnnotatedTextBuilder;
import org.languagetool.rules.RuleMatch;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.util.*;


@RestController
public class SpelCheckController {

    private static String[] charsToBeEncoded = new String[] {":", "/", "?", "#", "[", "]", "@", "!", "$", "&", "'", "(", ")", "*", "+", ",", ";", "="};

    public List<SpelCheckResponseElement> spellcheck(
            @RequestParam(name = "lang", defaultValue = "en-US") String language,
            @RequestParam(name = "text") String text) throws IOException
    {

        JLanguageTool langTool = new JLanguageTool(LanguageFactory.getLanguage(language));
        // comment in to use statistical ngram data:
        //langTool.activateLanguageModelRules(new File("/data/google-ngram-data"));
        List<RuleMatch> matches = langTool.check(text);
        List<SpelCheckResponseElement> responseMatches = new ArrayList<>();

        for (RuleMatch match : matches) {
            responseMatches.add(new SpelCheckResponseElement(match));
        }

        return responseMatches;
    }

    public SpelCheckController() {
    }

    @PostMapping("/spellcheck")
    public List<SpelCheckResponseElement> languagetool_check(@RequestBody SpelCheckRequest input) throws IOException {

        JLanguageTool langTool = new JLanguageTool(LanguageFactory.getLanguage(input.getLanguage()));

        langTool.activateLanguageModelRules(new File("/data/google-ngram-data"));

        List<SpelCheckResponseElement> responseMatches = new ArrayList<>();
        input.getElements().forEach(element -> {
            try {
                Parser parser = Parser.htmlParser().setTrackPosition(true);
                Document doc = Jsoup.parse(element.getText(), parser);

                var indexMapping = new HashMap<Integer,TextNode>();

                String plainText = JsoupHelper.getPlainText(doc,indexMapping);
                var matches = langTool.check(plainText);

                matches.forEach(match ->
                {
                    //Calculate how much index changes
                    Optional<Map.Entry<Integer, TextNode>> first = indexMapping.entrySet().stream().filter(x -> x.getKey()-1 <= match.getFromPos() && x.getKey() + x.getValue().text().length() >= match.getToPos()).findFirst();
                    if (first.isEmpty()){
                        throw new RuntimeException(); // Add exception.
                    }
                    int count = (int) countNumberOfOccurrences(plainText.substring(first.get().getKey()-1,match.getFromPos()), charsToBeEncoded);
                    int indexShift = first.get().getValue().sourceRange().start().columnNumber() - first.get().getKey() + (count)*4 ;

                    responseMatches.add(new SpelCheckResponseElement(element.getElementId(), match, indexShift, plainText));

                });
            } catch (IOException e) {
                e.printStackTrace();
            }
        });

        return responseMatches;
    }

    public static long countNumberOfOccurrences(String inputStr, String[] items) {
        return Arrays.stream(items).filter(inputStr::contains).count();
    }
}
