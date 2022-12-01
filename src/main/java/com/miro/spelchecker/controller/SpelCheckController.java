package com.miro.spelchecker.controller;

import com.miro.spelchecker.dto.LanguageFactory;
import com.miro.spelchecker.dto.SpelCheckRequest;
import com.miro.spelchecker.dto.SpelCheckRequestElement;
import com.miro.spelchecker.dto.SpelCheckResponseElement;
import com.miro.spelchecker.service.SpellCheckerService;
import org.languagetool.JLanguageTool;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.util.*;


@RestController
public class SpelCheckController {

    private final SpellCheckerService spellCheckerService;

    public SpelCheckController(SpellCheckerService spellCheckerService) {
        this.spellCheckerService = spellCheckerService;
    }

    @GetMapping(("/spellcheck"))
    public List<SpelCheckResponseElement> spellCheck(
            @RequestParam(name = "lang", defaultValue = "en-US") String language,
            @RequestParam(name = "text") String text) throws IOException
    {

        return spellCheckerService.spellCheck(language, new SpelCheckRequestElement(null,text));
    }

    @PostMapping("/spellcheck")
    public List<SpelCheckResponseElement> spellCheck(@RequestBody SpelCheckRequest input) throws IOException {

        JLanguageTool langTool = new JLanguageTool(LanguageFactory.getLanguage(input.getLanguage()));

        langTool.activateLanguageModelRules(new File("/data/google-ngram-data"));

        List<SpelCheckResponseElement> responseMatches = new ArrayList<>();
        input.getElements().forEach(element -> {
            try {
                responseMatches.addAll(spellCheckerService.spellCheck(input.getLanguage(), element));
            } catch (IOException e) {
                e.printStackTrace();
            }
        });

        return responseMatches;
    }
}
