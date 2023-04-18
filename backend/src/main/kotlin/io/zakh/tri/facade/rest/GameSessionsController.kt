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
    fun status(session: HttpSession): List<SessionDTO> {
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
    fun newSession(httpSession: HttpSession): SessionDTO {
        return service.newSession(httpSession.id).toDTO()
    }

    @GetMapping("{id}")
    fun getSession(
        httpSession: HttpSession,
        @PathVariable("id") sessionID: String
    ): SessionDTO? {
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
    fun changeConfig(
        httpSession: HttpSession,
        @PathVariable("id") sessionID: String,
        @RequestBody config: ChangeConfigDTO
    ) {
        service.changeConfig(httpSession.id, sessionID, config.toEntity())
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
    @PutMapping("{id}/state")
    fun changeState(
        httpSession: HttpSession,
        @PathVariable("id") sessionID: String,
        @RequestBody config: ChangeStateDTO
    ) {
        service.changeState(httpSession.id, sessionID, config.state)
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
    fun changeCell(
        httpSession: HttpSession,
        @PathVariable("id") sessionID: String,
        @PathVariable("cellIndex") cellIndex: Int,
        @RequestBody cell: ChangeFieldCellDTO
    ) {
        service.changeCell(httpSession.id, sessionID, cellIndex, cell.open)
    }

    @PostMapping("{id}/players")
    fun newPlayer(
        httpSession: HttpSession,
        @PathVariable("id") sessionID: String,
        @RequestBody newPlayer: PlayerDTO
    ) {
        return service.newPlayer(httpSession.id, sessionID, newPlayer.name)
    }

    @PatchMapping("{id}/players/{playerID}")
    fun changePlayer(
        httpSession: HttpSession,
        @PathVariable("id") sessionID: String,
        @RequestBody player: ChangePlayerDTO
    ) {
        service.changePlayer(httpSession.id, sessionID, player.name, player.captain, player.teamID)
    }
}