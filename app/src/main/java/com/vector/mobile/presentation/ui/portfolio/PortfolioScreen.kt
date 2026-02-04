package com.vector.mobile.presentation.ui.portfolio

import androidx.compose.foundation.background
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
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBalanceWallet
import androidx.compose.material.icons.filled.TrendingDown
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.vector.mobile.presentation.ui.components.VectorTopBar
import com.vector.mobile.presentation.ui.theme.VectorColors

data class Position(
    val id: String,
    val marketTitle: String,
    val side: String, // "YES" or "NO"
    val shares: Int,
    val avgPrice: Int, // cents
    val currentPrice: Int, // cents
    val pnl: Float, // dollars
    val pnlPercent: Float
)

private val samplePositions = listOf(
    Position(
        id = "1",
        marketTitle = "Will Bitcoin exceed $150,000 by end of 2026?",
        side = "YES",
        shares = 100,
        avgPrice = 35,
        currentPrice = 42,
        pnl = 7.00f,
        pnlPercent = 20.0f
    ),
    Position(
        id = "2",
        marketTitle = "Fed cuts interest rates in March 2026?",
        side = "YES",
        shares = 50,
        avgPrice = 60,
        currentPrice = 67,
        pnl = 3.50f,
        pnlPercent = 11.7f
    ),
    Position(
        id = "3",
        marketTitle = "Democrats win House in 2026 midterms?",
        side = "NO",
        shares = 75,
        avgPrice = 55,
        currentPrice = 62,
        pnl = 5.25f,
        pnlPercent = 12.7f
    ),
    Position(
        id = "4",
        marketTitle = "Chiefs win Super Bowl LX?",
        side = "YES",
        shares = 200,
        avgPrice = 28,
        currentPrice = 24,
        pnl = -8.00f,
        pnlPercent = -14.3f
    )
)

@Composable
fun PortfolioScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        VectorTopBar(title = "Portfolio")
        
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp)
        ) {
            // Portfolio summary card
            item {
                PortfolioSummaryCard()
            }
            
            // Section header
            item {
                Text(
                    text = "OPEN POSITIONS",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(vertical = 8.dp)
                )
            }
            
            // Position cards
            items(samplePositions) { position ->
                PositionCard(position = position)
            }
        }
    }
}

@Composable
private fun PortfolioSummaryCard() {
    val totalValue = 156.75f
    val totalPnl = 7.75f
    val totalPnlPercent = 5.2f
    
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        ),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.2f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.AccountBalanceWallet,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(24.dp)
                    )
                }
                Column {
                    Text(
                        text = "Total Portfolio Value",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "$${String.format("%.2f", totalValue)}",
                        style = MaterialTheme.typography.headlineLarge,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // P&L summary
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(
                        text = "Total P&L",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Icon(
                            imageVector = if (totalPnl >= 0) Icons.Default.TrendingUp else Icons.Default.TrendingDown,
                            contentDescription = null,
                            tint = if (totalPnl >= 0) VectorColors.positive else VectorColors.negative,
                            modifier = Modifier.size(20.dp)
                        )
                        Text(
                            text = "${if (totalPnl >= 0) "+" else ""}$${String.format("%.2f", totalPnl)}",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.SemiBold,
                            color = if (totalPnl >= 0) VectorColors.positive else VectorColors.negative
                        )
                    }
                }
                
                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        text = "Return",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "${if (totalPnlPercent >= 0) "+" else ""}${String.format("%.1f", totalPnlPercent)}%",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.SemiBold,
                        color = if (totalPnlPercent >= 0) VectorColors.positive else VectorColors.negative
                    )
                }
            }
        }
    }
}

@Composable
private fun PositionCard(position: Position) {
    val isProfit = position.pnl >= 0
    val pnlColor = if (isProfit) VectorColors.positive else VectorColors.negative
    
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        ),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            // Market title
            Text(
                text = position.marketTitle,
                style = MaterialTheme.typography.titleSmall,
                color = MaterialTheme.colorScheme.onSurface,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )
            
            Spacer(modifier = Modifier.height(12.dp))
            
            // Position details row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                // Side + Shares
                Column {
                    Text(
                        text = "Position",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        SideBadge(side = position.side)
                        Text(
                            text = "× ${position.shares}",
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                }
                
                // Avg price
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "Avg",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "${position.avgPrice}¢",
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                // Current price
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "Now",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "${position.currentPrice}¢",
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }
                
                // P&L
                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        text = "P&L",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "${if (isProfit) "+" else ""}$${String.format("%.2f", position.pnl)}",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = pnlColor
                    )
                }
            }
        }
    }
}

@Composable
private fun SideBadge(side: String) {
    val color = if (side == "YES") VectorColors.positive else VectorColors.negative
    
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(4.dp))
            .background(color.copy(alpha = 0.2f))
            .padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Text(
            text = side,
            style = MaterialTheme.typography.labelMedium,
            fontWeight = FontWeight.Bold,
            color = color
        )
    }
}
