package com.jalsoochak.water_supply_calculation_service.tenant;

public class TenantContext {
    private static final ThreadLocal<String> TENANT_ID = new ThreadLocal<>();

    private TenantContext() {

    }

    public static void setTenantId(String tenantId) {
        TENANT_ID.set(tenantId);
    }

    public static String getTenantId() {
        return TENANT_ID.get();
    }

    public static void clear() {
        TENANT_ID.remove();
    }
}
