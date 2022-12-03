package io.zakh.tri.dao

import io.zakh.tri.model.Player
import org.springframework.data.keyvalue.repository.KeyValueRepository
import org.springframework.stereotype.Repository

@Repository
interface PlayersRepo : KeyValueRepository<Player, String>