package com.miro.spelchecker.dto;

import org.languagetool.Language;
import org.languagetool.language.*;

public class LanguageFactory {

    public static Language getLanguage(String code) {
        switch (code) {
            case "en-US":
                return new AmericanEnglish();
            case "en-EN":
                return new BritishEnglish();
            case "es-ES":
                return new Spanish();
            case "de":
                return new GermanyGerman();
            case "ru-RU":
                return new Russian();
            case "fr-FR":
                return new French();
            case "jp-JP":
                return new Japanese();
            default:
                return null;
        }
    }
}
