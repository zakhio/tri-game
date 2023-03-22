package io.zakh.tri.facade.rest.dto

import io.zakh.tri.model.GameSession

data class GameSessionDTO(
    val id: String,
    val players: List<PlayerDTO>,

    val state: GameSession.State,

    val config: GameConfigDTO? = null,
    val cells: List<GameFieldCellDTO>,
)

fun GameSession.toDTO(): GameSessionDTO {
    return GameSessionDTO(
        this.id,
        this.players.map { it.toDTO(this.captains.contains(it.id), this.playerIDtoTeamID[it.id]) },
        this.state,
        this.config?.toDTO(),
        this.cells.map { it.toDTO() })
}