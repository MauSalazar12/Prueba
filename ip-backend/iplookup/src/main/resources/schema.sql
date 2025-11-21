CREATE TABLE IF NOT EXISTS ip_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ip VARCHAR(50),
    ip_type VARCHAR(20),
    country VARCHAR(1000),
    region VARCHAR(1000),
    city VARCHAR(1000),
    isp VARCHAR(200),
    threat_info VARCHAR(200)
);
