package io.zakh.tri.facade.rest

import io.swagger.v3.oas.annotations.tags.Tag
import io.zakh.tri.facade.rest.dto.PlayerDTO
import io.zakh.tri.facade.rest.dto.SessionDTO
import io.zakh.tri.facade.rest.dto.toDTO
import io.zakh.tri.service.PlayerService
import jakarta.servlet.http.HttpSession
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("users")
@Tag(name = "user", description = "the user API")
class PlayerController(
    val service: PlayerService
) {
    @GetMapping("/me")
    fun getMe(httpSession: HttpSession): PlayerDTO {
        return service.getPlayer(httpSession.id).toDTO()
    }
}