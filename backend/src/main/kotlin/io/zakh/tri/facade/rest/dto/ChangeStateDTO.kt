package io.zakh.tri.facade.rest.dto

import io.zakh.tri.model.GameSession

data class ChangeStateDTO(
    val state: GameSession.State = GameSession.State.IN_PROGRESS,
)