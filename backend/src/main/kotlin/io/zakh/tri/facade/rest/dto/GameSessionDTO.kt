package io.zakh.tri.facade.rest.dto

import io.zakh.tri.model.GameSession

data class GameSessionDTO(
    val id: String,
    val array: List<PlayerDTO>,

    val state: String,

    val config: GameConfigDTO? = null,
    val cells: List<GameFieldCellDTO>? = null,
)

fun GameSession.toDTO(): GameSessionDTO {
    return GameSessionDTO(
        this.id,
        this.players.map { it.toDTO(this.id) },
        this.state.name,
        this.config?.toDTO(),
        this.cells?.map { it.toDTO() })
}