package com.vector.mobile.presentation.ui.news

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.vector.mobile.presentation.ui.components.VectorTopBar
import com.vector.mobile.presentation.ui.theme.VectorColors

data class NewsItem(
    val id: String,
    val title: String,
    val source: String,
    val timeAgo: String,
    val category: String,
    val sentiment: Float, // -1 to 1
    val relevantMarket: String? = null
)

private val sampleNews = listOf(
    NewsItem(
        id = "1",
        title = "Fed signals potential rate cut in March 2026 meeting",
        source = "Reuters",
        timeAgo = "2h ago",
        category = "Economics",
        sentiment = 0.6f,
        relevantMarket = "Fed rate cut by March?"
    ),
    NewsItem(
        id = "2",
        title = "SpaceX Starship completes successful orbital test",
        source = "TechCrunch",
        timeAgo = "4h ago",
        category = "Tech",
        sentiment = 0.8f,
        relevantMarket = "Starship lands on Mars in 2026?"
    ),
    NewsItem(
        id = "3",
        title = "Bitcoin breaks $100k amid institutional buying surge",
        source = "CoinDesk",
        timeAgo = "6h ago",
        category = "Crypto",
        sentiment = 0.9f,
        relevantMarket = "BTC above $150k by EOY?"
    ),
    NewsItem(
        id = "4",
        title = "Primary results shake up 2026 midterm predictions",
        source = "Politico",
        timeAgo = "8h ago",
        category = "Politics",
        sentiment = -0.2f,
        relevantMarket = "Democrats win House?"
    ),
    NewsItem(
        id = "5",
        title = "Chiefs favored in Super Bowl LX odds",
        source = "ESPN",
        timeAgo = "12h ago",
        category = "Sports",
        sentiment = 0.3f,
        relevantMarket = "Chiefs win Super Bowl?"
    )
)

private val categories = listOf("All", "Politics", "Economics", "Tech", "Crypto", "Sports")

@Composable
fun NewsScreen() {
    var selectedCategory by remember { mutableStateOf("All") }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        VectorTopBar(title = "News Feed")
        
        // Category filters
        LazyRow(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(categories) { category ->
                FilterChip(
                    selected = selectedCategory == category,
                    onClick = { selectedCategory = category },
                    label = { 
                        Text(
                            text = category,
                            style = MaterialTheme.typography.labelMedium
                        )
                    },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = MaterialTheme.colorScheme.primary,
                        selectedLabelColor = MaterialTheme.colorScheme.onPrimary,
                        containerColor = MaterialTheme.colorScheme.surfaceVariant,
                        labelColor = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                )
            }
        }
        
        // News list
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp)
        ) {
            val filteredNews = if (selectedCategory == "All") {
                sampleNews
            } else {
                sampleNews.filter { it.category == selectedCategory }
            }
            
            items(filteredNews) { news ->
                NewsCard(news = news)
            }
        }
    }
}

@Composable
private fun NewsCard(news: NewsItem) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { /* TODO: Open news detail */ },
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        ),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            // Header row: Category badge + time + bookmark
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    CategoryBadge(category = news.category)
                    Text(
                        text = news.timeAgo,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                IconButton(
                    onClick = { /* TODO: Bookmark */ },
                    modifier = Modifier.size(32.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.BookmarkBorder,
                        contentDescription = "Bookmark",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            // Title
            Text(
                text = news.title,
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onSurface,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            // Source + Sentiment
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = news.source,
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                
                SentimentIndicator(sentiment = news.sentiment)
            }
            
            // Related market
            news.relevantMarket?.let { market ->
                Spacer(modifier = Modifier.height(12.dp))
                RelatedMarketChip(marketName = market)
            }
        }
    }
}

@Composable
private fun CategoryBadge(category: String) {
    val color = when (category) {
        "Politics" -> Color(0xFF8B5CF6) // Purple
        "Economics" -> Color(0xFF3B82F6) // Blue
        "Tech" -> Color(0xFF10B981) // Green
        "Crypto" -> Color(0xFFF59E0B) // Amber
        "Sports" -> Color(0xFFEF4444) // Red
        else -> MaterialTheme.colorScheme.primary
    }
    
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(4.dp))
            .background(color.copy(alpha = 0.2f))
            .padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Text(
            text = category.uppercase(),
            style = MaterialTheme.typography.labelSmall,
            color = color
        )
    }
}

@Composable
private fun SentimentIndicator(sentiment: Float) {
    val color = when {
        sentiment > 0.3f -> VectorColors.positive
        sentiment < -0.3f -> VectorColors.negative
        else -> VectorColors.neutral
    }
    val label = when {
        sentiment > 0.3f -> "Bullish"
        sentiment < -0.3f -> "Bearish"
        else -> "Neutral"
    }
    
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Box(
            modifier = Modifier
                .size(8.dp)
                .clip(RoundedCornerShape(4.dp))
                .background(color)
        )
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall,
            color = color
        )
    }
}

@Composable
private fun RelatedMarketChip(marketName: String) {
    Row(
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(MaterialTheme.colorScheme.surface)
            .clickable { /* TODO: Navigate to market */ }
            .padding(horizontal = 12.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Icon(
            imageVector = Icons.Default.TrendingUp,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier.size(16.dp)
        )
        Text(
            text = marketName,
            style = MaterialTheme.typography.labelMedium,
            color = MaterialTheme.colorScheme.primary
        )
    }
}
