package com.jalsoochak.bfm_reading_service.models.app.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BfmRequestDto {
    private String readingUrl;

    private BigDecimal confirmedReading;

    private Long stateSchemeId;

    private Long centreSchemeId;

    private String phoneNumber;

    private LocalDateTime readingDateTime;

    private GeoLocation geolocation;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GeoLocation {
        private String type;
        private Double[] coordinates;

        public void setCoordinates(Double longitude, Double latitude) {
            this.coordinates = new Double[]{longitude, latitude};
        }

        public Double getLongitude() {
            return coordinates != null && coordinates.length > 0 ? coordinates[0] : null;
        }

        public Double getLatitude() {
            return coordinates != null && coordinates.length > 1 ? coordinates[1] : null;
        }
    }
}
