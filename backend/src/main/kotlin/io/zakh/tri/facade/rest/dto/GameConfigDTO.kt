package io.zakh.tri.facade.rest.dto

import io.zakh.tri.model.GameSession
import jakarta.validation.constraints.Positive

data class GameConfigDTO(
    @Positive
    val columnCount: Int,
    @Positive
    val rowsCount: Int,

    @Positive
    val teamsCount: Int,

    val language: String?,
) {
    fun toEntity(): GameSession.Config {
        return GameSession.Config(
            columnCount,
            rowsCount,
            teamsCount,
            language
        )
    }
}

fun GameSession.Config.toDTO(): GameConfigDTO {
    return GameConfigDTO(
        this.columnCount,
        this.rowsCount,
        this.teamsCount,
        this.language
    )
}