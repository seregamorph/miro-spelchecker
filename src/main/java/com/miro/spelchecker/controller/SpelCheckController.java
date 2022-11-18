package com.miro.spelchecker.controller;

import com.google.gson.Gson;
import com.miro.spelchecker.dto.LanguageFactory;
import com.miro.spelchecker.dto.SpelCheckResponseElement;
import com.miro.spelchecker.dto.SpelCheckRequest;
import org.languagetool.JLanguageTool;
import org.languagetool.rules.RuleMatch;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

@RestController
public class SpelCheckController {

    private final Gson gson = new Gson();

    @GetMapping("/spellcheck")
    public String spellcheck (@RequestParam(name = "lang") String language, @RequestParam(name = "text") String text) throws Exception {

        JLanguageTool langTool = new JLanguageTool(LanguageFactory.getLanguage(language));
        // comment in to use statistical ngram data:
        //langTool.activateLanguageModelRules(new File("/data/google-ngram-data"));
        List<RuleMatch> matches = langTool.check(text);
        List<SpelCheckResponseElement> responseMatches = new ArrayList<>();

        for (RuleMatch match : matches) {
            responseMatches.add(new SpelCheckResponseElement(match));
        }

        return gson.toJson(responseMatches);
    }

    @PostMapping("/spellcheck")
        public String languagetool_check (@RequestBody SpelCheckRequest input) {

        JLanguageTool langTool = new JLanguageTool(LanguageFactory.getLanguage(input.getLanguage()));

        List<SpelCheckResponseElement> responseMatches = new ArrayList<>();
        input.getElements().forEach(element -> {
            try {
                var matches = langTool.check(element.getText());
                matches.forEach( match -> responseMatches.add(new SpelCheckResponseElement(element.getElementId(),match)));
            } catch (IOException e) {
                e.printStackTrace();
            }
        });

        return gson.toJson(responseMatches);
    }
}
