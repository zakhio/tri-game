package io.zakh.tri.facade.rest.dto

import io.zakh.tri.model.GameSession

data class GameSessionDTO(
    val id: String,
    val state: String,
    val array: List<PlayerDTO>
)

fun GameSession.toDTO(): GameSessionDTO {
    return GameSessionDTO(this.id, this.state.name, this.players.map { it.toDTO(this.id) })
}