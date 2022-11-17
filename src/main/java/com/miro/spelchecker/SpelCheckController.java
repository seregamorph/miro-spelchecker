package com.miro.spelchecker;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.net.ssl.HttpsURLConnection;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;

@RestController
public class SpelCheckController {

    private static final String host = "https://api.bing.microsoft.com";
    private static final String path = "/v7.0/spellcheck";
    private static final String key = "d278257a74424d4ea2f941d5d149f865";

    private static final String mode = "proof";

    @GetMapping("/spellcheck")
    public static String check (@RequestParam(name = "lang") Language language, @RequestParam(name = "text") String text) throws Exception {
        String params = "?mkt=" + language.languageCode + "&mode=" + mode;

        URL url = new URL(host + path + params);
        HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();

        doRequest(text, connection);

        StringBuffer content = readResponse(connection);
        connection.disconnect();

        return content.toString();
    }

    private static void doRequest(String text, HttpsURLConnection connection) throws IOException {
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        connection.setRequestProperty("Ocp-Apim-Subscription-Key", key);
        connection.setDoOutput(true);

        DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
        wr.writeBytes("text=" + text);
        wr.flush();
        wr.close();
    }

    private static StringBuffer readResponse(HttpsURLConnection connection) throws IOException {

        BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));

        String inputLine;
        StringBuffer content = new StringBuffer();
        while ((inputLine = in.readLine()) != null) {
            content.append(inputLine);
        }
        in.close();
        return content;
    }
}
