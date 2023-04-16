package io.zakh.tri.service

import io.zakh.tri.dao.PlayersRepo
import io.zakh.tri.model.Player
import io.zakh.tri.service.exceptions.PlayerNotFoundException
import org.springframework.stereotype.Service

/**
 * Simple player management service.
 */
@Service
class PlayerService(
    val playersRepo: PlayersRepo
) {
    /**
     * Adds new player or returns an existing one.
     *
     * @param playerID the id of the players
     */
    fun newPlayer(playerID: String, name: String): Player {
        return playersRepo.findById(playerID).orElseGet { playersRepo.save(Player(playerID, name)) }
    }

    /**
     * Gets information about the player.
     *
     * @param playerID  the id of player
     */
    fun getPlayer(playerID: String): Player {
        return playersRepo.findById(playerID)
            .orElseThrow { PlayerNotFoundException("session $playerID does not exist") }
    }
}