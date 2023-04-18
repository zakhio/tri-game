package io.zakh.tri.model

/**
 * This class presents cell with word, its type and the status.
 *
 * Most of the cells will be just regulars, some of them will belong
 * to teams. Also, this object contains information the team which opened
 * it.
 */
data class GameFieldCell(
    val word: String,
    val type: Type = Type.REGULAR,
    val ownerTeamId: Int? = null,

    val open: Boolean = false,
    val openTeamId: Int? = null
) {
    enum class Type {
        REGULAR,
        TEAM_OWNED,
        END_GAME
    }
}