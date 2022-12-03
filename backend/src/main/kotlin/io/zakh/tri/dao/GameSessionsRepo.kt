package io.zakh.tri.dao

import io.zakh.tri.model.GameSession
import org.springframework.data.keyvalue.repository.KeyValueRepository
import org.springframework.stereotype.Repository

@Repository
interface GameSessionsRepo : KeyValueRepository<GameSession, String>