package com.miro.spelchecker.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.languagetool.JLanguageTool;
import org.languagetool.ResultCache;
import org.languagetool.language.*;

public class LanguageToolFactory {

    private static final JLanguageTool americanEnglishLangTool = new JLanguageTool(new AmericanEnglish(), null, new ResultCache(1000L));

    public static JLanguageTool getLanguageTool(String languageCode) throws JsonProcessingException {
        americanEnglishLangTool.disableRule("UPPERCASE_SENTENCE_START");
        switch (languageCode) {
            case "en-EN":
                return new JLanguageTool(new BritishEnglish());
            case "es-ES":
                return new JLanguageTool(new Spanish());
            case "de":
                return new JLanguageTool(new GermanyGerman());
            case "ru-RU":
                return new JLanguageTool(new Russian());
            case "fr-FR":
                return new JLanguageTool(new French());
            case "jp-JP":
                return new JLanguageTool(new Japanese());
            default:
                return americanEnglishLangTool;
        }
    }
}
