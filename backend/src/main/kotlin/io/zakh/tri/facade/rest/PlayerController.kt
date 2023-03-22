package io.zakh.tri.facade.rest

import io.zakh.tri.facade.rest.dto.PlayerDTO
import io.zakh.tri.facade.rest.dto.toDTO
import io.zakh.tri.service.PlayerService
import jakarta.servlet.http.HttpSession
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("api/players")
class PlayerController(
    val service: PlayerService
) {
    @GetMapping("/me")
    fun getMe(httpSession: HttpSession): PlayerDTO {
        return service.getPlayer(httpSession.id).toDTO()
    }
}