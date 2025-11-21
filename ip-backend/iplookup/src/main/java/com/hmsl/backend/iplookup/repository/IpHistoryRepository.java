package com.hmsl.backend.iplookup.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hmsl.backend.iplookup.model.IpHistory;

public interface IpHistoryRepository extends JpaRepository<IpHistory, Long> {
    boolean existsByIp(String ip);
    Optional<IpHistory> findByIp(String ip);
}