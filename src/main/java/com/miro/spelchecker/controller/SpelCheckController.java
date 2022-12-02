package com.miro.spelchecker.controller;

import com.miro.spelchecker.dto.SpelCheckRequest;
import com.miro.spelchecker.dto.SpelCheckRequestElement;
import com.miro.spelchecker.dto.SpelCheckResponseElement;
import com.miro.spelchecker.service.SpellCheckerService;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;


@RestController
public class SpelCheckController {

    private final SpellCheckerService spellCheckerService;

    public SpelCheckController(SpellCheckerService spellCheckerService) {
        this.spellCheckerService = spellCheckerService;
    }

    @GetMapping(("/spellcheck"))
    public List<SpelCheckResponseElement> spellCheck(
            @RequestParam(name = "lang", defaultValue = "en-US") String language,
            @RequestParam(name = "text") String text) throws IOException {
        return spellCheckerService.spellCheck(language, new SpelCheckRequestElement(null,text));
    }

    @PostMapping("/spellcheck")
    public List<SpelCheckResponseElement> spellCheck(@RequestBody SpelCheckRequest input) throws IOException {
        return spellCheckerService.spellCheck(input.getLanguage(), input.getElements());
    }
}
