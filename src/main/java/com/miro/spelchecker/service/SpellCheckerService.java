package com.miro.spelchecker.service;

import com.miro.spelchecker.dto.SpelCheckRequestElement;
import com.miro.spelchecker.dto.SpelCheckResponseElement;

import java.io.IOException;
import java.util.List;

public interface SpellCheckerService {
    List<SpelCheckResponseElement> spellCheck(String language, SpelCheckRequestElement element) throws IOException;

    List<SpelCheckResponseElement> spellCheck(String language, List<SpelCheckRequestElement> element) throws IOException;
}
