package io.zakh.tri.facade.rest.dto

import io.zakh.tri.model.GameSession
import jakarta.validation.constraints.Positive

data class ChangeConfigDTO(
    @Positive
    val columnCount: Int = 0,

    @Positive
    val rowsCount: Int = 0,

    @Positive
    val teamsCount: Int = 0,

    val language: String? = null,
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

fun GameSession.Config.toDTO(): ChangeConfigDTO {
    return ChangeConfigDTO(
        this.columnCount,
        this.rowsCount,
        this.teamsCount,
        this.language
    )
}