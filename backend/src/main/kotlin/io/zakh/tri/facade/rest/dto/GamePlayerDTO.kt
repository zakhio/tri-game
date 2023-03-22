package io.zakh.tri.facade.rest.dto

import io.zakh.tri.model.Player

data class PlayerDTO(
    val id: String,
    val initialized: Boolean = false,
    val captain: Boolean = false,
    val teamID: Int? = null
)

fun Player.toDTO(captain: Boolean = false, teamID: Int? = null): PlayerDTO {
    return PlayerDTO(
        this.id,
        this.initialized,
        captain,
        teamID
    )
}