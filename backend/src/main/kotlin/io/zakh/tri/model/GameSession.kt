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
    val config: Config? = null,
    val cells: List<GameFieldCell>? = null,
) {
    enum class State {
        IDLE, IN_PROGRESS, FINISHED
    }

    /**
     * Configuration for square game field of TRI Game, its sizes, language and number of playing teams.
     */
    data class Config(
        val columnCount: Int,
        val rowsCount: Int,

        val teamsCount: Int,

        // if null default language will be played
        val language: String? = null,
    )
}