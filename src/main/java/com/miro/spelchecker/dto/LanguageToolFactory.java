package com.miro.spelchecker.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.languagetool.JLanguageTool;
import org.languagetool.ResultCache;

import java.util.HashMap;
import java.util.Map;

public class LanguageToolFactory {

    private static Map<String,JLanguageTool> languageTools = new HashMap<>();

    public static JLanguageTool getLanguageTool(String languageCode) throws JsonProcessingException {
        if (!languageTools.containsKey(languageCode)) {
            var language = LanguageFactory.getLanguage(languageCode);
            if (language == null ) {
                System.out.println("Language not found :" + languageCode);
                return getLanguageTool("en-US");
            }

            try {
                var langTool =new JLanguageTool(language, null, new ResultCache(1000L));
                langTool.disableRule("UPPERCASE_SENTENCE_START");
                languageTools.put(languageCode,langTool);
            } catch (Exception e) {
                e.printStackTrace();
                return getLanguageTool("en-US");
            }
        }
        return languageTools.get(languageCode);
    }
}
