package com.vector.mobile.domain.repository

import com.vector.mobile.domain.model.Market
import com.vector.mobile.domain.model.MarketCategory
import kotlinx.coroutines.flow.Flow

interface MarketRepository {
    fun getMarkets(category: MarketCategory? = null): Flow<List<Market>>
    suspend fun refreshMarkets()
    suspend fun getMarket(id: String): Market?
    fun searchMarkets(query: String): Flow<List<Market>>
}
