package com.miro.spelchecker.dto;

import org.languagetool.Language;
import org.languagetool.language.*;

public class LanguageFactory {

    public static Language getLanguage(String code) {
        return switch (code) {
            case "en-US" -> new AmericanEnglish();
            case "en-EN" -> new BritishEnglish();
            case "es-ES" -> new Spanish();
            case "de" -> new GermanyGerman();
            case "ru-RU" -> new Russian();
            case "fr-FR" -> new French();
            case "jp-JP" -> new Japanese();
            default ->  new AmericanEnglish();
        };
    }
}
