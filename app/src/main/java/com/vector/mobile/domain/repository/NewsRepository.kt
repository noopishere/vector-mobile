package com.vector.mobile.domain.repository

import com.vector.mobile.domain.model.NewsArticle
import com.vector.mobile.domain.model.NewsCategory
import kotlinx.coroutines.flow.Flow

interface NewsRepository {
    fun getNews(category: NewsCategory? = null): Flow<List<NewsArticle>>
    suspend fun refreshNews()
    suspend fun getArticle(id: String): NewsArticle?
    suspend fun bookmarkArticle(id: String)
    suspend fun unbookmarkArticle(id: String)
    fun getBookmarkedArticles(): Flow<List<NewsArticle>>
}
