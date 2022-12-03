package io.zakh.tri.facade.rest.dto

import io.zakh.tri.model.GameFieldCell

data class GameFieldCellDTO(
    val word: String,
    val type: String,
    val ownerTeamId: Int? = null,

    val open: Boolean = false,
    val openTeamId: Int? = null
)

fun GameFieldCell.toDTO(): GameFieldCellDTO {
    return GameFieldCellDTO(
        this.word,
        this.type.name,
        this.ownerTeamId,
        this.open,
        this.openTeamId
    )
}