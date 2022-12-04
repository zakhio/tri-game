package io.zakh.tri.facade.rest

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.zakh.tri.facade.rest.dto.GameConfigDTO
import io.zakh.tri.facade.rest.dto.GameSessionDTO
import io.zakh.tri.facade.rest.dto.toDTO
import io.zakh.tri.service.GameSessionsService
import jakarta.servlet.http.HttpSession
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime
import java.time.ZoneOffset

@RestController
@RequestMapping("api/sessions")
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
        val gameSession = service.newSession(httpSession.id)
        return gameSession.toDTO()
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
//    @ResponseStatus(HttpStatus.ACCEPTED)
    fun newGame(
        httpSession: HttpSession,
        @PathVariable("id") sessionID: String,
        @RequestBody config: GameConfigDTO
    ) {
        service.newGame(httpSession.id, sessionID, config.toEntity())
    }
}