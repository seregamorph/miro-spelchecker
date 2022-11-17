package com.miro.spelchecker;

public enum Language {
    EN_US("en-US");

    public final String languageCode;

    private Language(String languageCode) {
        this.languageCode = languageCode;
    }
}
