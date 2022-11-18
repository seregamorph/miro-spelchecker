package com.miro.spelchecker.controller;

import com.miro.spelchecker.dto.LanguageFactory;
import com.miro.spelchecker.dto.SpelCheckRequest;
import com.miro.spelchecker.dto.SpelCheckResponseElement;
import org.languagetool.JLanguageTool;
import org.languagetool.rules.RuleMatch;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
public class SpelCheckController {

    @GetMapping("/spellcheck")
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

    @PostMapping("/spellcheck")
    public List<SpelCheckResponseElement> languagetool_check(@RequestBody SpelCheckRequest input) {

        JLanguageTool langTool = new JLanguageTool(LanguageFactory.getLanguage(input.getLanguage()));

        List<SpelCheckResponseElement> responseMatches = new ArrayList<>();
        input.getElements().forEach(element -> {
            try {
                var matches = langTool.check(element.getText());
                matches.forEach(match -> responseMatches.add(new SpelCheckResponseElement(element.getElementId(), match)));
            } catch (IOException e) {
                e.printStackTrace();
            }
        });

        return responseMatches;
    }
}
