package io.zakh.tri.service

import io.zakh.tri.dao.GameSessionsRepo
import io.zakh.tri.dao.PlayersRepo
import io.zakh.tri.model.GameSession
import io.zakh.tri.model.Player
import org.springframework.stereotype.Service

/**
 * Represent game logic for TRI Game.
 */
@Service
class GameSessionsService(
    val sessionsRepo: GameSessionsRepo,
    val playersRepo: PlayersRepo,
    // 0 and O are excluded, because they are similar visually
    val sessionIDCharPool: List<Char> = ('a'..'z') + ('A'..'N') + ('P'..'Z') + ('1'..'9'),
) {
    /**
     * Starts a new game session,
     */
    fun newSession(playerID: String): GameSession {
        // 12,960,000 of values
        val sessionID = List(4) { sessionIDCharPool.random() }.joinToString("")

        val player = playersRepo.findById(playerID).orElseGet { Player(playerID) }
        player.sessions = player.sessions + sessionID
        playersRepo.save(player)

        val newSession = GameSession(
            sessionID,
            listOf(Player(playerID)),
        )

        return sessionsRepo.save(newSession)
    }

    fun getAll(): List<GameSession> {
        return sessionsRepo.findAll()
    }
}