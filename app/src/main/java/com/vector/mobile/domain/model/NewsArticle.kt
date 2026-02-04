package com.vector.mobile.domain.model

import java.time.Instant

data class NewsArticle(
    val id: String,
    val title: String,
    val summary: String?,
    val source: String,
    val url: String,
    val imageUrl: String?,
    val category: NewsCategory,
    val sentiment: Float, // -1.0 (bearish) to 1.0 (bullish)
    val publishedAt: Instant,
    val relatedMarketId: String? = null
)

enum class NewsCategory {
    POLITICS,
    ECONOMICS,
    TECH,
    CRYPTO,
    SPORTS,
    OTHER
}
