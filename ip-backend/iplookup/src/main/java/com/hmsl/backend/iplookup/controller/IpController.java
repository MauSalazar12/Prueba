package com.hmsl.backend.iplookup.controller;

import com.hmsl.backend.iplookup.model.IpHistory;
import com.hmsl.backend.iplookup.service.IpService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ips")
@CrossOrigin(origins = "*")
public class IpController {

    private final IpService ipService;

    public IpController(IpService ipService) {
        this.ipService = ipService;
    }

    @PostMapping("/lookup")
    public ResponseEntity<?> lookup(@RequestBody Map<String, String> body) {
        String ip = body.get("ip");

        var existing = ipService.findByIp(ip);
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(existing.get());
        }

        var saved = ipService.lookupAndSave(ip);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public List<IpHistory> getAll() {
        return ipService.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ipService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
