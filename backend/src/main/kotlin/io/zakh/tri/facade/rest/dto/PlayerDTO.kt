package io.zakh.tri.facade.rest.dto

import io.zakh.tri.model.Player

data class PlayerDTO(
    val id: String,
    val name: String
)

fun Player.toDTO(): PlayerDTO {
    return PlayerDTO(
        this.id,
        this.name
    )
}
