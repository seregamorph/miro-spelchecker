package com.miro.spelchecker.config;

import com.miro.spelchecker.filter.SecurityHeadersFilter;
import lombok.val;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebConfig {

    @Bean
    public FilterRegistrationBean<SecurityHeadersFilter> securityHeadersFilterBean() {
        val filter = new SecurityHeadersFilter();
        val bean = new FilterRegistrationBean<>(filter);
        bean.setOrder(10);
        return bean;
    }
}
