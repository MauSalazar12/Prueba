package com.hmsl.backend.iplookup.dto;

import java.time.OffsetDateTime;

public class IpDto {
    private Long id;
    private String ip;
    private String ipType;
    private String country;
    private String region;
    private String city;
    private String isp;
    private String threatInfo;
    private OffsetDateTime createdAt;
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getIp() {
        return ip;
    }
    public void setIp(String ip) {
        this.ip = ip;
    }
    public String getIpType() {
        return ipType;
    }
    public void setIpType(String ipType) {
        this.ipType = ipType;
    }
    public String getCountry() {
        return country;
    }
    public void setCountry(String country) {
        this.country = country;
    }
    public String getRegion() {
        return region;
    }
    public void setRegion(String region) {
        this.region = region;
    }
    public String getCity() {
        return city;
    }
    public void setCity(String city) {
        this.city = city;
    }
    public String getIsp() {
        return isp;
    }
    public void setIsp(String isp) {
        this.isp = isp;
    }
    public String getThreatInfo() {
        return threatInfo;
    }
    public void setThreatInfo(String threatInfo) {
        this.threatInfo = threatInfo;
    }
    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    

}
