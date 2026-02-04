package com.vector.mobile.presentation.ui.markets

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
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.TrendingDown
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.vector.mobile.presentation.ui.components.VectorTopBar
import com.vector.mobile.presentation.ui.theme.VectorColors

data class Market(
    val id: String,
    val title: String,
    val category: String,
    val yesPrice: Int, // 0-100 cents
    val volume: String,
    val change24h: Float, // percentage
    val endDate: String
)

private val sampleMarkets = listOf(
    Market(
        id = "1",
        title = "Will Bitcoin exceed $150,000 by end of 2026?",
        category = "Crypto",
        yesPrice = 42,
        volume = "$2.4M",
        change24h = 5.2f,
        endDate = "Dec 31, 2026"
    ),
    Market(
        id = "2",
        title = "Fed cuts interest rates in March 2026?",
        category = "Economics",
        yesPrice = 67,
        volume = "$1.8M",
        change24h = 3.1f,
        endDate = "Mar 31, 2026"
    ),
    Market(
        id = "3",
        title = "Democrats win House in 2026 midterms?",
        category = "Politics",
        yesPrice = 38,
        volume = "$5.2M",
        change24h = -2.4f,
        endDate = "Nov 3, 2026"
    ),
    Market(
        id = "4",
        title = "Tesla delivers 3M vehicles in 2026?",
        category = "Tech",
        yesPrice = 55,
        volume = "$890K",
        change24h = 1.8f,
        endDate = "Dec 31, 2026"
    ),
    Market(
        id = "5",
        title = "Chiefs win Super Bowl LX?",
        category = "Sports",
        yesPrice = 24,
        volume = "$3.1M",
        change24h = -0.5f,
        endDate = "Feb 8, 2026"
    ),
    Market(
        id = "6",
        title = "GPT-5 released by end of Q2 2026?",
        category = "Tech",
        yesPrice = 72,
        volume = "$1.2M",
        change24h = 8.3f,
        endDate = "Jun 30, 2026"
    )
)

private val marketCategories = listOf("All", "Politics", "Economics", "Tech", "Crypto", "Sports")

@Composable
fun MarketsScreen() {
    var selectedCategory by remember { mutableStateOf("All") }
    var searchQuery by remember { mutableStateOf("") }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        VectorTopBar(title = "Markets")
        
        // Search bar
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            placeholder = { 
                Text(
                    "Search markets...",
                    style = MaterialTheme.typography.bodyMedium
                )
            },
            leadingIcon = {
                Icon(
                    imageVector = Icons.Default.Search,
                    contentDescription = "Search",
                    tint = MaterialTheme.colorScheme.onSurfaceVariant
                )
            },
            singleLine = true,
            shape = RoundedCornerShape(12.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = MaterialTheme.colorScheme.primary,
                unfocusedBorderColor = MaterialTheme.colorScheme.outline,
                focusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
                unfocusedContainerColor = MaterialTheme.colorScheme.surfaceVariant
            )
        )
        
        // Category filters
        LazyRow(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(marketCategories) { category ->
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
        
        // Markets list
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp)
        ) {
            val filteredMarkets = sampleMarkets
                .filter { market ->
                    (selectedCategory == "All" || market.category == selectedCategory) &&
                    (searchQuery.isEmpty() || market.title.contains(searchQuery, ignoreCase = true))
                }
            
            items(filteredMarkets) { market ->
                MarketCard(market = market)
            }
        }
    }
}

@Composable
private fun MarketCard(market: Market) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { /* TODO: Open market detail */ },
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        ),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            // Category + End date
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                MarketCategoryBadge(category = market.category)
                Text(
                    text = "Ends ${market.endDate}",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            // Market title
            Text(
                text = market.title,
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onSurface,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Price + Change + Volume
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Bottom
            ) {
                // YES Price (main focus)
                Column {
                    Text(
                        text = "YES",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Text(
                            text = "${market.yesPrice}¢",
                            style = MaterialTheme.typography.headlineMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        PriceChange(change = market.change24h)
                    }
                }
                
                // NO Price (derived)
                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        text = "NO",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "${100 - market.yesPrice}¢",
                        style = MaterialTheme.typography.titleLarge,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            // Volume indicator
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Text(
                    text = "Volume:",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = market.volume,
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }
        }
    }
}

@Composable
private fun MarketCategoryBadge(category: String) {
    val color = when (category) {
        "Politics" -> Color(0xFF8B5CF6)
        "Economics" -> Color(0xFF3B82F6)
        "Tech" -> Color(0xFF10B981)
        "Crypto" -> Color(0xFFF59E0B)
        "Sports" -> Color(0xFFEF4444)
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
private fun PriceChange(change: Float) {
    val isPositive = change >= 0
    val color = if (isPositive) VectorColors.positive else VectorColors.negative
    val icon = if (isPositive) Icons.Default.TrendingUp else Icons.Default.TrendingDown
    
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(2.dp)
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = color,
            modifier = Modifier.size(16.dp)
        )
        Text(
            text = "${if (isPositive) "+" else ""}${String.format("%.1f", change)}%",
            style = MaterialTheme.typography.labelMedium,
            color = color
        )
    }
}
