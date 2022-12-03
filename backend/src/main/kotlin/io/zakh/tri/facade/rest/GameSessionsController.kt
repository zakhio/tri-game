package io.zakh.tri.facade.rest

import io.zakh.tri.facade.rest.dto.GameSessionDTO
import io.zakh.tri.facade.rest.dto.toDTO
import io.zakh.tri.service.GameSessionsService
import jakarta.servlet.http.HttpSession
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
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

    @PostMapping
    fun newSession(session: HttpSession): GameSessionDTO {
        val gameSession = service.newSession(session.id)
        return gameSession.toDTO()
    }
}