package controller

import (
	"sync"

	"github.com/zakhio/online-games/tri/server/game"
	"github.com/zakhio/online-games/tri/server/middleware/random"
)

type SessionController interface {
	Create() game.TRISession
	GetSession(sessionID string) game.TRISession
}

type sessionController struct {
	mu sync.RWMutex

	sessions *sync.Map
	pool     *sync.Pool
}

func (c *sessionController) Create() game.TRISession {
	c.mu.RLock()
	defer c.mu.RUnlock()

	id := c.nextSessionId()
	session := c.pool.Get().(game.TRISession)
	session.SetID(id)
	c.sessions.Store(id, session)

	return session
}

func (c *sessionController) GetSession(sessionID string) game.TRISession {
	c.mu.Lock()
	defer c.mu.Unlock()

	session, ok := c.sessions.Load(sessionID)
	if ok {
		return session.(game.TRISession)
	}

	return nil
}

func (c *sessionController) nextSessionId() string {
	ok := true
	id := ""

	// generate id until no collision
	for ok {
		id = random.RandString(4)
		_, ok = c.sessions.Load(id)
	}

	return id
}

func NewSessionController() SessionController {
	sessions := &sync.Map{}
	pool := &sync.Pool{
		New: func() interface{} {
			return game.NewTRISession()
		},
	}

	return &sessionController{
		sessions: sessions,
		pool:     pool,
	}
}
