package io.zakh.tri.facade.rest.dto

import io.zakh.tri.model.GameFieldCell

data class FieldCellDTO(
    val word: String,
    val type: GameFieldCell.Type,
    val ownerTeamId: Int? = null,

    val open: Boolean = false,
    val openTeamId: Int? = null
)

fun GameFieldCell.toDTO(): FieldCellDTO {
    return FieldCellDTO(
        this.word,
        this.type,
        this.ownerTeamId,
        this.open,
        this.openTeamId
    )
}