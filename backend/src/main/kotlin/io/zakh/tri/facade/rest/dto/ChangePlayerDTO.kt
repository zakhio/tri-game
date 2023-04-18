package io.zakh.tri.facade.rest.dto

data class ChangePlayerDTO(
    val name: String,
    val captain: Boolean,
    val teamID: Int
)