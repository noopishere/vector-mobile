package com.vector.mobile.presentation.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBalanceWallet
import androidx.compose.material.icons.filled.Newspaper
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.ShowChart
import androidx.compose.material.icons.outlined.AccountBalanceWallet
import androidx.compose.material.icons.outlined.Newspaper
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material.icons.outlined.ShowChart
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(
    val route: String,
    val title: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector
) {
    data object News : Screen(
        route = "news",
        title = "News",
        selectedIcon = Icons.Filled.Newspaper,
        unselectedIcon = Icons.Outlined.Newspaper
    )
    
    data object Markets : Screen(
        route = "markets",
        title = "Markets",
        selectedIcon = Icons.Filled.ShowChart,
        unselectedIcon = Icons.Outlined.ShowChart
    )
    
    data object Portfolio : Screen(
        route = "portfolio",
        title = "Portfolio",
        selectedIcon = Icons.Filled.AccountBalanceWallet,
        unselectedIcon = Icons.Outlined.AccountBalanceWallet
    )
    
    data object Settings : Screen(
        route = "settings",
        title = "Settings",
        selectedIcon = Icons.Filled.Settings,
        unselectedIcon = Icons.Outlined.Settings
    )
}

val bottomNavItems = listOf(
    Screen.News,
    Screen.Markets,
    Screen.Portfolio,
    Screen.Settings
)
