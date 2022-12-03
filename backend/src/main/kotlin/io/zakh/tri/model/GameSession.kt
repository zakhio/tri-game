package io.zakh.tri.model

import org.springframework.data.annotation.Id
import org.springframework.data.keyvalue.annotation.KeySpace

/**
 * GameSession represent intent of a group of players, however it does not mean that game
 * is started. At the beginning its status is IDLE, so there is no config and cells.
 * For IN_PROGRESS and FINISHED, config and cells will be present.
 */
@KeySpace("game-sessions")
data class GameSession(
    @Id
    val id: String,

    val players: List<Player>,

    val state: State = State.IDLE,
    val config: GameConfig? = null,
    val cells: List<GameFieldCell>? = null,
) {
    enum class State {
        IDLE, IN_PROGRESS, FINISHED
    }
}