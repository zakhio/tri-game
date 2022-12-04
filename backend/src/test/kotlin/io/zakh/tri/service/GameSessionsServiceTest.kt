package io.zakh.tri.service

import io.zakh.tri.model.GameFieldCell
import io.zakh.tri.model.GameSession
import io.zakh.tri.model.Player
import io.zakh.tri.service.exceptions.SessionNotFoundException
import io.zakh.tri.service.exceptions.UnauthorizedPlayerException
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.any
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import java.util.*
import kotlin.random.Random

class GameSessionsServiceTest {
    @Test
    fun newSession() {
        val service = GameSessionsService(mock(), mock())

        val playerID = Random.nextInt().toString()

        whenever(service.playersRepo.findById(playerID))
            .thenReturn(Optional.of(Player(playerID)))

        whenever(service.sessionsRepo.save(any<GameSession>()))
            .thenAnswer { it.getArgument<GameSession>(0) }

        val session = service.newSession(playerID)
        assertNotNull(session)
        assertTrue(session.players.any { it.id == playerID })
    }

    @Test
    fun newGame() {
        val service = GameSessionsService(mock(), mock())

        val playerID = Random.nextInt().toString()

        whenever(service.playersRepo.findById(playerID))
            .thenReturn(Optional.of(Player(playerID)))

        whenever(service.sessionsRepo.save(any<GameSession>()))
            .thenAnswer { it.getArgument<GameSession>(0) }

        val session = service.newSession(playerID)
        assertNotNull(session)
        assertTrue(session.players.any { it.id == playerID })
    }

    @Test
    fun newGame_sessionNotFound() {
        val service = GameSessionsService(mock(), mock())

        val playerID = Random.nextInt().toString()
        val sessionID = Random.nextInt().toString()
        val config = GameSession.Config(0, 0, 0)

        assertThrows<SessionNotFoundException> { service.newGame(playerID, sessionID, config) }
    }

    @Test
    fun newGame_userWhichIsNotPlayerStartsTheGame() {
        val service = GameSessionsService(mock(), mock())

        val playerID = Random.nextInt().toString()
        val sessionID = Random.nextInt().toString()
        val config = GameSession.Config(0, 0, 0)

        whenever(service.sessionsRepo.findById(sessionID))
            .thenReturn(Optional.of(GameSession(sessionID, emptyList())))

        assertThrows<UnauthorizedPlayerException> { service.newGame(playerID, sessionID, config) }
    }

    @Test
    fun newGame_success() {
        val service = GameSessionsService(mock(), mock())

        val playerID = Random.nextInt().toString()
        val sessionID = Random.nextInt().toString()
        val config = GameSession.Config(4, 3, 1)
        val session = GameSession(sessionID, listOf(Player(playerID)))

        whenever(service.sessionsRepo.findById(sessionID)).thenReturn(Optional.of(session))
        whenever(service.sessionsRepo.save(any<GameSession>()))
            .thenAnswer { it.getArgument<GameSession>(0) }

        val sessionWithGame = service.newGame(playerID, sessionID, config)
        assertEquals(sessionWithGame.state, GameSession.State.IN_PROGRESS)
        assertNotNull(sessionWithGame.cells)
        assertEquals(sessionWithGame.cells?.size, config.rowsCount * config.columnCount)
        assertEquals(sessionWithGame.cells?.count { it.type == GameFieldCell.Type.END_GAME }, 1)
        assertEquals(
            sessionWithGame.cells?.count { it.type == GameFieldCell.Type.TEAM_OWNED },
            (config.rowsCount * config.columnCount) / (config.teamsCount + 1)
        )
        assertEquals(
            sessionWithGame.cells?.filter { it.ownerTeamId != null }?.map { it.ownerTeamId }
                ?.toSet()?.size,
            config.teamsCount
        )
    }
}