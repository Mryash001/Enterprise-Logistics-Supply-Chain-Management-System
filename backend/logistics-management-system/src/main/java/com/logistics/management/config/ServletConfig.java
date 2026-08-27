package com.logistics.management.config;

import com.logistics.management.servlet.BulkManifestServlet;
import jakarta.servlet.MultipartConfigElement;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ServletConfig {

    @Bean
    public ServletRegistrationBean<BulkManifestServlet> bulkManifestServlet() {

        MultipartConfigElement multipartConfig =
                new MultipartConfigElement(
                        System.getProperty("java.io.tmpdir"),
                        50 * 1024 * 1024,
                        50 * 1024 * 1024,
                        1024 * 1024
                );

        ServletRegistrationBean<BulkManifestServlet> registration =
                new ServletRegistrationBean<>(
                        new BulkManifestServlet(),
                        "/api/manifest/upload"
                );

        registration.setMultipartConfig(multipartConfig);

        return registration;
    }
}