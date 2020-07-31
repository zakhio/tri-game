package controller

import (
	"github.com/zakhio/online-games/tri/server/config"
	"sync"

	"github.com/zakhio/online-games/tri/server/middleware/random"
	"github.com/zakhio/online-games/tri/server/tri-game"
)

type SessionController interface {
	Create() triGame.TRISession
	GetSession(sessionID string) triGame.TRISession
}

type sessionController struct {
	mu sync.RWMutex

	sessions *sync.Map
	pool     *sync.Pool
}

func (c *sessionController) Create() triGame.TRISession {
	c.mu.RLock()
	defer c.mu.RUnlock()

	id := c.nextSessionId()
	session := c.pool.Get().(triGame.TRISession)
	session.SetID(id)
	c.sessions.Store(id, session)

	return session
}

func (c *sessionController) GetSession(sessionID string) triGame.TRISession {
	c.mu.Lock()
	defer c.mu.Unlock()

	session, ok := c.sessions.Load(sessionID)
	if ok {
		return session.(triGame.TRISession)
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

func NewSessionController(d *config.Dictionary) SessionController {
	sessions := &sync.Map{}
	pool := &sync.Pool{
		New: func() interface{} {
			return triGame.NewTRISession(d)
		},
	}

	return &sessionController{
		sessions: sessions,
		pool:     pool,
	}
}
