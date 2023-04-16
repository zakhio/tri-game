package io.zakh.tri.facade.rest.dto

import io.zakh.tri.model.GameSession

data class SessionDTO(
    val id: String,
    val players: List<PlayerDTO>,

    val state: GameSession.State,

    val captains: Set<String> = emptySet(),
    val playerIDtoTeamID: Map<String, Int> = emptyMap(),

    val config: ChangeConfigDTO? = null,
    val cells: List<FieldCellDTO>,
)

fun GameSession.toDTO(): SessionDTO {
    return SessionDTO(
        this.id,
        this.players.map { it.toDTO() },
        this.state,
        this.captains,
        this.playerIDtoTeamID,
        this.config?.toDTO(),
        this.cells.map { it.toDTO() })
}