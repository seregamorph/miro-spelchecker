package com.miro.spelchecker.controller;

import com.miro.spelchecker.dto.LanguageFactory;
import com.miro.spelchecker.dto.SpelCheckRequest;
import com.miro.spelchecker.dto.SpelCheckRequestElement;
import com.miro.spelchecker.dto.SpelCheckResponseElement;
import org.jsoup.Jsoup;
import org.jsoup.nodes.*;
import org.jsoup.parser.Parser;
import org.languagetool.JLanguageTool;
import org.languagetool.rules.RuleMatch;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.util.*;


@RestController
public class SpelCheckController {

    @GetMapping(("/spellcheck"))
    public List<SpelCheckResponseElement> spellCheck(
            @RequestParam(name = "lang", defaultValue = "en-US") String language,
            @RequestParam(name = "text") String text) throws IOException
    {

        JLanguageTool langTool = new JLanguageTool(LanguageFactory.getLanguage(language));
        langTool.activateLanguageModelRules(new File("/data/google-ngram-data"));
        return this.spellCheck(langTool, new SpelCheckRequestElement(null,text));
    }

    public SpelCheckController() {
    }

    @PostMapping("/spellcheck")
    public List<SpelCheckResponseElement> spellCheck(@RequestBody SpelCheckRequest input) throws IOException {

        JLanguageTool langTool = new JLanguageTool(LanguageFactory.getLanguage(input.getLanguage()));

        langTool.activateLanguageModelRules(new File("/data/google-ngram-data"));

        List<SpelCheckResponseElement> responseMatches = new ArrayList<>();
        input.getElements().forEach(element -> {
            try {
                responseMatches.addAll(spellCheck(langTool, element));
            } catch (IOException e) {
                e.printStackTrace();
            }
        });

        return responseMatches;
    }

    private List<SpelCheckResponseElement> spellCheck(JLanguageTool langTool, SpelCheckRequestElement element) throws IOException {
        Parser parser = Parser.htmlParser().setTrackPosition(true);
        Document doc = Jsoup.parse(element.getText(), parser);

        List<SpelCheckResponseElement> responseMatches = new ArrayList<>();
        var indexMapping = new HashMap<Integer,TextNode>();

        // Jsoup parses the dom tree into nodes, all nodes that contain text are textnodes.
        // indexMapping map stores <start position of the text node within plain text, textNode>
        // textNodes know their start positions in the original input.
        // with the help of indexmapping, we can calculate the error position in the original input.
        String plainText = JsoupHelper.getPlainText(doc,indexMapping);
        var matches = langTool.check(plainText);

        matches.forEach(match ->
        {
            //Calculate how much index changes: find the textnode that this match is contained in.
            //calculate the difference between its start index in the plaintext vs in the original html.
            Optional<Map.Entry<Integer, TextNode>> plainTextNodeMapping = indexMapping.entrySet().stream().filter(x -> x.getKey()-1 <= match.getFromPos() && x.getKey() + x.getValue().text().length() >= match.getToPos()).findFirst();
            if (plainTextNodeMapping.isEmpty()){
                throw new RuntimeException(); // Add exception.
            }

            responseMatches.add(new SpelCheckResponseElement(element.getElementId(), match, plainText, plainTextNodeMapping.get().getKey(), plainTextNodeMapping.get().getValue()));

        });

        return responseMatches;
    }

}
