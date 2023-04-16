package io.zakh.tri.service

import io.zakh.tri.dao.GameSessionsRepo
import io.zakh.tri.model.GameFieldCell
import io.zakh.tri.model.GameSession
import io.zakh.tri.service.exceptions.GameIsNotStartedException
import io.zakh.tri.service.exceptions.InvalidCellIndexException
import io.zakh.tri.service.exceptions.SessionNotFoundException
import io.zakh.tri.service.exceptions.UnauthorizedPlayerException
import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.decodeFromStream
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service
import kotlin.random.Random

/**
 * Represent game logic for TRI Game.
 *
 * Rectangular game field consists unique words of picked language:
 * * One of them is end game so the team who picked it loses automatically.
 * * Equal number of word belonging to each team
 *
 * Game ends when all words of one team are open.
 *
 * The configuration of words per langauge is in resources/dictionary.json file
 * (uses ExperimentalSerializationApi for deserializing).
 */
@OptIn(ExperimentalSerializationApi::class)
@Service
class GameSessionsService(
    val sessionsRepo: GameSessionsRepo,
    val playerService: PlayerService,
    val messagingTemplate: SimpMessagingTemplate
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

        val player = playerService.newPlayer(playerID, "")

        val newSession = GameSession(
            sessionID,
            listOf(player),
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
    fun changeConfig(playerID: String, sessionID: String, config: GameSession.Config): GameSession {
        val session = sessionsRepo.findById(sessionID)
            .orElseThrow { SessionNotFoundException("session $sessionID does not exist") }

        if (session.players.none { it.id == playerID }) {
            throw UnauthorizedPlayerException("player $playerID is not part of session $sessionID")
        }

        val dictionary = gameWordsConfig.words[config.language]
            ?: gameWordsConfig.words[gameWordsConfig.defaultLanguage]!!

        val totalCellCount = config.rowsCount * config.columnCount
        val teamSize = totalCellCount / (config.teamsCount + 1)

        val words = mutableSetOf<String>()
        while (words.size < totalCellCount) {
            words.add(dictionary.random())
        }

        // This code creates a pair of a random number and the cell configuration, then sorts it
        // by the first number, the resulted order of cell configurations is the game field.
        val cells = words.mapIndexed { index, word ->
            var teamID: Int? = null
            var cellType = GameFieldCell.Type.REGULAR

            if (index / teamSize < config.teamsCount) {
                teamID = index / teamSize
                cellType = GameFieldCell.Type.TEAM_OWNED
            }

            if (index == totalCellCount - 1) {
                cellType = GameFieldCell.Type.END_GAME
            }

            Random.nextInt(totalCellCount * 10) to GameFieldCell(word, cellType, teamID)
        }.sortedBy { it.first }.map { it.second }.toMutableList()

        return sessionsRepo.save(
            session.copy(
                state = GameSession.State.IN_PROGRESS,
                config = config,
                cells = cells,
            )
        )
    }

    fun changeState(playerID: String, sessionID: String, state: GameSession.State): GameSession {
        val session = sessionsRepo.findById(sessionID)
            .orElseThrow { SessionNotFoundException("session $sessionID does not exist") }

        if (session.players.none { it.id == playerID }) {
            throw UnauthorizedPlayerException("player $playerID is not part of session $sessionID")
        }

        return session
    }

    fun getSession(sessionID: String): GameSession? {
        return sessionsRepo.findById(sessionID)
            .orElseThrow { SessionNotFoundException("session $sessionID does not exist") }
    }

    fun getAll(): List<GameSession> {
        return sessionsRepo.findAll()
    }

    fun newPlayer(playerID: String, sessionID: String, name: String) {
        var session = sessionsRepo.findById(sessionID)
            .orElseThrow { SessionNotFoundException("session $sessionID does not exist") }

        val player = playerService.newPlayer(playerID, name)
        if (session.players.none { it.id == playerID }) {
            session = sessionsRepo.save(session.copy(players = session.players + player))
        }

        messagingTemplate.convertAndSend("/session/${sessionID}", session)
    }

    fun changePlayer(
        playerID: String,
        sessionID: String,
        name: String,
        captain: Boolean,
        teamID: Int
    ) {
        var session = sessionsRepo.findById(sessionID)
            .orElseThrow { SessionNotFoundException("session $sessionID does not exist") }

        val players = if (session.players.none { it.id == playerID }) {
            session.players.toMutableList() + playerService.newPlayer(playerID, name)
        } else {
            // TODO: Implement change of name for existing user"
            session.players
        }

        val captains: Set<String> = if (captain) {
            session.captains.toMutableSet() + playerID
        } else {
            session.captains.toMutableSet() - playerID
        }

        val playerIDtoTeamID = session.playerIDtoTeamID.toMutableMap()
        playerIDtoTeamID[playerID] = teamID

        session = sessionsRepo.save(
            session.copy(
                players = players,
                captains = captains,
                playerIDtoTeamID = playerIDtoTeamID
            )
        )
        messagingTemplate.convertAndSend("/session/${sessionID}", session)
    }

    fun changeCell(
        playerID: String,
        sessionID: String,
        cellIndex: Int,
        openCell: Boolean
    ): GameSession {
        var session = sessionsRepo.findById(sessionID)
            .orElseThrow { SessionNotFoundException("session $sessionID does not exist") }

        if (session.players.none { it.id == playerID }) {
            throw UnauthorizedPlayerException("player $playerID is not part of session $sessionID")
        }

        if (session.state == GameSession.State.IDLE) {
            throw GameIsNotStartedException("game in session $sessionID is not started")
        }

        if (cellIndex < 0 || cellIndex >= session.cells.size) {
            throw InvalidCellIndexException("game in session $sessionID is not started")
        }

        if (!session.cells[cellIndex].open && openCell) {
            val cells = session.cells.toMutableList()
            cells[cellIndex] =
                cells[cellIndex].copy(open = true, openTeamId = session.playerIDtoTeamID[playerID])

            var state = GameSession.State.IN_PROGRESS
            if (cells[cellIndex].type == GameFieldCell.Type.END_GAME) {
                state = GameSession.State.FINISHED
            } else if (cells[cellIndex].type == GameFieldCell.Type.TEAM_OWNED
                && cells.none {
                    it.type == GameFieldCell.Type.TEAM_OWNED
                            && it.ownerTeamId == cells[cellIndex].ownerTeamId
                            && !it.open
                }
            ) {
                state = GameSession.State.FINISHED
            }

            session = sessionsRepo.save(
                session.copy(
                    cells = cells,
                    state = state
                )
            )

            messagingTemplate.convertAndSend("/session/$sessionID", session)
        }

        return session
    }
}