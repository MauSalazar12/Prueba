package com.hmsl.backend.iplookup.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.hmsl.backend.iplookup.model.IpHistory;
import com.hmsl.backend.iplookup.repository.IpHistoryRepository;

@Service
public class IpService {

    private final IpHistoryRepository repo;
    private final WebClient webClient;

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    @Value("${ip.api.url}")
    private String ipApiUrl;

    @Value("${ip.api.key}")
    private String ipApiKey;

    public IpService(IpHistoryRepository repo, WebClient.Builder webClientBuilder) {
        this.repo = repo;
        this.webClient = webClientBuilder.build();
    }

    public List<IpHistory> findAll() {
        return repo.findAll();
    }

    public Optional<IpHistory> findByIp(String ip) {
        return repo.findByIp(ip);
    }

    public IpHistory lookupAndSave(String ip) {

        if (!isValidIp(ip)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "IP inválida");
        }

        if (repo.existsByIp(ip)) {
            return repo.findByIp(ip).orElseThrow();
        }

        Map<String, Object> api = callExternalApi(ip);

        IpHistory record = new IpHistory();
        record.setIp(ip);
        record.setIpType(String.valueOf(api.get("type")));
        record.setCountry(String.valueOf(api.get("country")));
        record.setRegion(String.valueOf(api.get("region")));
        record.setCity(String.valueOf(api.get("city")));

        record.setLatitude(
                api.get("latitude") != null ? Double.valueOf(api.get("latitude").toString()) : null);

        record.setLongitude(
                api.get("longitude") != null ? Double.valueOf(api.get("longitude").toString()) : null);

        record.setIsp(String.valueOf(api.get("isp")));
        record.setThreatInfo(String.valueOf(api.get("threat")));

        IpHistory saved = repo.save(record);

        notifyEmitters(saved);
        return saved;
    }

    private boolean isValidIp(String ip) {
        String ipv4 = "^(25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)(\\.(25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)){3}$";
        String ipv6 = "([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}";
        return ip.matches(ipv4) || ip.matches(ipv6);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> callExternalApi(String ip) {
        try {
            String url = ipApiUrl
                    .replace("{ip}", ip)
                    .replace("{key}", ipApiKey);

            Map<String, Object> response = webClient.get()
                    .uri(url)
                    .header("Accept", "application/json")
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null) {
                throw new RuntimeException("IPRegistry returned null");
            }

            Map<String, Object> result = new HashMap<>();

            result.put("ip", response.get("ip"));
            result.put("type", response.get("type"));

            Map<String, Object> location = (Map<String, Object>) response.get("location");
            if (location != null) {

                Map<String, Object> country = (Map<String, Object>) location.get("country");
                if (country != null) {
                    result.put("country", country.get("name")); // safe
                }

                Map<String, Object> region = (Map<String, Object>) location.get("region");
                if (region != null) {
                    result.put("region", region.get("name"));
                }

                result.put("city", location.get("city"));

                result.put("latitude", location.get("latitude"));
                result.put("longitude", location.get("longitude"));
            }

            Map<String, Object> connection = (Map<String, Object>) response.get("connection");
            if (connection != null) {
                result.put("isp", connection.get("organization"));
            }

            Map<String, Object> security = (Map<String, Object>) response.get("security");
            if (security != null) {
                result.put("threat", security.get("is_threat"));
            }

            return result;

        } catch (Exception ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Error calling IPRegistry: " + ex.getMessage(),
                    ex);
        }
    }

    private void notifyEmitters(IpHistory saved) {
        List<SseEmitter> deadEmitters = new ArrayList<>();
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("new-ip").data(saved));
            } catch (Exception e) {
                deadEmitters.add(emitter);
            }
        }
        emitters.removeAll(deadEmitters);
    }

    public SseEmitter subscribeToEvents() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));

        return emitter;
    }

    public void deleteById(Long id) {
        repo.deleteById(id);
    }
}
