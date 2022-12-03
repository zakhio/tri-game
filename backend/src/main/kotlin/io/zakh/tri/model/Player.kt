package io.zakh.tri.model

import org.springframework.data.annotation.Id
import org.springframework.data.keyvalue.annotation.KeySpace

/**
 * Represents player and captain sessions and belonging to the teams in these sessions.
 *
 * Note: There is no notion of teams to reduce complexity of queries to the persistence layer.
 */
@KeySpace("player")
data class Player(
    @Id
    val id: String,
    var sessions: Set<String> = emptySet(),
    var captainSessions: Set<String> = emptySet(),
    var teamIdInSession: Map<String, Int> = emptyMap(),
)
