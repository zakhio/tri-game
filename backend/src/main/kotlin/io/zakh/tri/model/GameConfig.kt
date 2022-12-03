package io.zakh.tri.model

/**
 * Configuration for square game field of TRI Game, its sizes, language and number of playing teams.
 */
data class GameConfig(
    val columnCount: Int,
    val rowsCount: Int,

    val teamsCount: Int,

    val language: String,
)