package io.zakh.tri.facade.rest

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import io.zakh.tri.facade.rest.dto.*
import io.zakh.tri.service.GameSessionsService
import jakarta.servlet.http.HttpSession
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime
import java.time.ZoneOffset

@RestController
@RequestMapping("sessions")
@Tag(name = "game session", description = "the Game Session API")
class GameSessionsController(
    val service: GameSessionsService
) {
    @GetMapping
    fun status(session: HttpSession): List<GameSessionDTO> {
        println(LocalDateTime.ofEpochSecond(session.creationTime / 1000, 0, ZoneOffset.UTC))
        println(LocalDateTime.ofEpochSecond(session.lastAccessedTime / 1000, 0, ZoneOffset.UTC))
        session.attributeNames.iterator().forEach {
            println("key: $it value: ${session.getAttribute(it)}")
        }
        session.setAttribute("tester", "Andrey")

        return service.getAll().map { it.toDTO() }
    }

    @Operation(
        summary = "Start a new session.",
        description = "Starts a new game session with http session holder as a player."
    )
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "201",
            description = "Session created"
        ), ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = [Content(schema = Schema(implementation = String::class))]
        )]
    )
    @PostMapping
    fun newSession(httpSession: HttpSession): GameSessionDTO {
        return service.newSession(httpSession.id).toDTO()
    }

    @GetMapping("{id}")
    fun getSession(
        httpSession: HttpSession,
        @PathVariable("id") sessionID: String
    ): GameSessionDTO? {
        return service.getSession(sessionID)?.toDTO()
    }

    @Operation(
        summary = "Start a new game for the specified session.",
        description = "Starts a new game for a session with http session holder as a player."
    )
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "201",
            description = "Session created"
        ), ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = [Content(schema = Schema(implementation = String::class))]
        )]
    )
    @PutMapping("{id}/config")
    fun newGame(
        httpSession: HttpSession,
        @PathVariable("id") sessionID: String,
        @RequestBody config: GameConfigDTO
    ) {
        service.newGame(httpSession.id, sessionID, config.toEntity())
    }

    @Operation(
        summary = "Update the state of the cell.",
        description = "Updates the state of the game for a session with http session holder as a player."
    )
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Cell updated"
        ), ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = [Content(schema = Schema(implementation = String::class))]
        )]
    )
    @PutMapping("{id}/cells/{cellIndex}")
    fun updateCell(
        httpSession: HttpSession,
        @PathVariable("id") sessionID: String,
        @PathVariable("cellIndex") cellIndex: Int,
        @RequestBody cell: UpdateGameFieldCellDTO
    ) {
        service.updateCell(httpSession.id, sessionID, cellIndex, cell.open)
    }

    @PostMapping("{id}/players")
    fun newPlayers(httpSession: HttpSession, @PathVariable("id") sessionID: String): PlayerDTO {
        return service.newPlayer(httpSession.id, sessionID)
            .toDTO().players.find { it.id == httpSession.id }!!
    }
}