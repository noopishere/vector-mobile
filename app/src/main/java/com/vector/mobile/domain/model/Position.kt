package com.vector.mobile.domain.model

import java.time.Instant

data class Position(
    val id: String,
    val marketId: String,
    val marketTitle: String,
    val side: PositionSide,
    val shares: Int,
    val averagePrice: Int, // cents
    val currentPrice: Int, // cents
    val openedAt: Instant
) {
    val costBasis: Int get() = shares * averagePrice
    val currentValue: Int get() = shares * currentPrice
    val pnl: Int get() = currentValue - costBasis
    val pnlPercent: Float get() = if (costBasis > 0) (pnl.toFloat() / costBasis) * 100 else 0f
}

enum class PositionSide {
    YES,
    NO
}
