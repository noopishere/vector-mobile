package com.vector.mobile.presentation.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Vector dark theme colors
private val VectorDarkColorScheme = darkColorScheme(
    primary = Color(0xFF10B981),           // Emerald green
    onPrimary = Color(0xFF0A0A0B),
    primaryContainer = Color(0xFF064E3B),
    onPrimaryContainer = Color(0xFF6EE7B7),
    
    secondary = Color(0xFF3B82F6),          // Blue for secondary actions
    onSecondary = Color(0xFF0A0A0B),
    secondaryContainer = Color(0xFF1E3A5F),
    onSecondaryContainer = Color(0xFF93C5FD),
    
    tertiary = Color(0xFFF59E0B),           // Amber for warnings/highlights
    onTertiary = Color(0xFF0A0A0B),
    
    background = Color(0xFF0A0A0B),         // Near black
    onBackground = Color(0xFFFAFAFA),
    
    surface = Color(0xFF111113),            // Slightly lighter surface
    onSurface = Color(0xFFFAFAFA),
    surfaceVariant = Color(0xFF18181B),     // Card backgrounds
    onSurfaceVariant = Color(0xFFA1A1AA),
    
    outline = Color(0xFF27272A),            // Borders
    outlineVariant = Color(0xFF3F3F46),
    
    error = Color(0xFFEF4444),              // Red for errors/negative
    onError = Color(0xFFFFFFFF),
    
    inverseSurface = Color(0xFFFAFAFA),
    inverseOnSurface = Color(0xFF0A0A0B),
)

// Semantic colors
object VectorColors {
    val positive = Color(0xFF10B981)        // Green for gains
    val negative = Color(0xFFEF4444)        // Red for losses
    val neutral = Color(0xFFA1A1AA)         // Gray for neutral
    val chart = Color(0xFF3B82F6)           // Blue for charts
}

@Composable
fun VectorTheme(
    darkTheme: Boolean = true,  // Always dark for Vector aesthetic
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = VectorDarkColorScheme,
        typography = VectorTypography,
        content = content
    )
}
