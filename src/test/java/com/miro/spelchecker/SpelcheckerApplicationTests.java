package com.miro.spelchecker;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.stream.Stream;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class SpelcheckerApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    private static Stream<Arguments> provideEnglishStrings() {
        return Stream.of(
                //
                  Arguments.of("<b>F</b>ramez 1", 0, 6, 3, 13)
                , Arguments.of("Framez 1", 0, 6, 0, 6)
                , Arguments.of("They dont go", 5, 9, 5, 9)
                , Arguments.of("<html> <head></head><body><p>They</p><p>dont</p><p>go</p></body></html>", 8, 12, 40, 44 )
        );
    }

    @Test
    void contextLoads() {
    }

    @ParameterizedTest
    @MethodSource("provideEnglishStrings")
    void test(String text, int fromPosPlain, int toPosPlain, int fromPos, int toPos) throws Exception {

        if (this.mockMvc == null) {
            return;
        }
        this.mockMvc.perform(MockMvcRequestBuilders.get("/spellcheck?lang=en-US&&text=" + text))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].fromPosPlain").value(fromPosPlain))
                .andExpect(jsonPath("$[0].toPosPlain").value(toPosPlain))
                .andExpect(jsonPath("$[0].fromPos").value(fromPos))
                .andExpect(jsonPath("$[0].toPos").value(toPos));

    }

}
