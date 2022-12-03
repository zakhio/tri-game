package io.zakh.tri.service

import io.zakh.tri.dao.GameSessionsRepo
import io.zakh.tri.dao.PlayersRepo
import io.zakh.tri.model.GameFieldCell
import io.zakh.tri.model.GameSession
import io.zakh.tri.model.Player
import io.zakh.tri.service.exceptions.SessionNotFoundException
import io.zakh.tri.service.exceptions.UnauthorizedPlayerException
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.decodeFromStream
import org.springframework.stereotype.Service
import kotlin.random.Random

/**
 * Represent game logic for TRI Game.
 *
 * Rectangular game field consists unique words of picked language:
 * * One of them is end game so the team who picked it loses automatically.
 *
 * The configuration of words per langauge is in resources/dictionary.json file
 * (uses ExperimentalSerializationApi for deserializing).
 */
@OptIn(ExperimentalSerializationApi::class)
@Service
class GameSessionsService(
    val sessionsRepo: GameSessionsRepo, val playersRepo: PlayersRepo
) {
    @Serializable
    data class GameWordsConfig(val defaultLanguage: String, val words: Map<String, Set<String>>)

    private val gameWordsConfig =
        Json.decodeFromStream<GameWordsConfig>(javaClass.classLoader.getResourceAsStream("dictionary.json")!!)

    // 0 and O are excluded, because they are similar visually
    private val sessionIDCharPool: List<Char> = ('a'..'z') + ('A'..'N') + ('P'..'Z') + ('1'..'9')

    /**
     * Starts a new game session.
     *
     * Player who starts the session will be added to it automatically.
     *
     * @param playerID the id of player
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

    /**
     * Starts a new game in specified session.
     *
     * Only players in the session can start games.
     *
     * @param playerID  the id of player
     * @param sessionID the id of the session
     * @param config    the config of for the game
     */
    fun newGame(playerID: String, sessionID: String, config: GameSession.Config): GameSession {
        val session = sessionsRepo.findById(sessionID)
            .orElseThrow { SessionNotFoundException("session $sessionID does not exist") }

        if (session.players.none { it.id == playerID }) {
            throw UnauthorizedPlayerException("player $playerID is not part of session $sessionID")
        }

        val language =
            if (config.language in gameWordsConfig.words) config.language else gameWordsConfig.defaultLanguage

        val dictionary = gameWordsConfig.words[language]!!
        val totalCount = config.rowsCount * config.columnCount

        val words = mutableSetOf<String>()
        while (words.size < totalCount) {
            words.add(dictionary.random())
        }

        val cells = words.map { GameFieldCell(it) }.toMutableList()
        val engGameIndex = Random.nextInt(0, totalCount)
        cells[engGameIndex] = cells[engGameIndex].copy(type = GameFieldCell.Type.END_GAME)

        return sessionsRepo.save(
            session.copy(
                state = GameSession.State.IN_PROGRESS, config = config, cells = cells
            )
        )
    }

    fun getAll(): List<GameSession> {
        return sessionsRepo.findAll()
    }
}