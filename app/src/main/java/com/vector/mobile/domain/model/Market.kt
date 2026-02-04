package com.vector.mobile.domain.model

import java.time.Instant

data class Market(
    val id: String,
    val title: String,
    val description: String?,
    val category: MarketCategory,
    val yesPrice: Int, // 0-100 (cents)
    val noPrice: Int,  // 0-100 (cents)
    val volume: Long,  // Total volume in cents
    val change24h: Float, // Percentage change
    val openTime: Instant,
    val closeTime: Instant,
    val status: MarketStatus
)

enum class MarketCategory {
    POLITICS,
    ECONOMICS,
    TECH,
    CRYPTO,
    SPORTS,
    OTHER
}

enum class MarketStatus {
    OPEN,
    CLOSED,
    RESOLVED_YES,
    RESOLVED_NO
}
