package io.zakh.tri.facade.rest.dto

import io.zakh.tri.model.Player

data class PlayerDTO(
    val id: String,
    val captain: Boolean = false,
)

fun Player.toDTO(sessionID: String): PlayerDTO {
    return PlayerDTO(
        this.id,
        this.captainSessions.contains(sessionID)
    )
}