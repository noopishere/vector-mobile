package com.vector.mobile.domain.repository

import com.vector.mobile.domain.model.Position
import kotlinx.coroutines.flow.Flow

interface PortfolioRepository {
    fun getPositions(): Flow<List<Position>>
    suspend fun getPosition(id: String): Position?
    fun getTotalValue(): Flow<Int>
    fun getTotalPnl(): Flow<Int>
}
