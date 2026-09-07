package com.workersden.entity;
import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(with = JsonFormat.Feature.ACCEPT_CASE_INSENSITIVE_PROPERTIES)

public enum Role {
    CUSTOMER,
    WORKER,
    ADMIN
}


