package persistence

import (
	cconf "github.com/pip-services3-go/pip-services3-commons-go/config"
	cpersist "github.com/pip-services3-go/pip-services3-data-go/persistence"
)

type BeaconsFilePersistence struct {
	BeaconsMemoryPersistence
	persister *cpersist.JsonFilePersister
}

func NewBeaconsFilePersistence(path string) *BeaconsFilePersistence {
	c := BeaconsFilePersistence{}
	c.BeaconsMemoryPersistence = *NewBeaconsMemoryPersistence()
	c.persister = cpersist.NewJsonFilePersister(c.Prototype, path)
	c.Loader = c.persister
	c.Saver = c.persister
	return &c
}

func (c *BeaconsFilePersistence) Configure(config *cconf.ConfigParams) {
	c.BeaconsMemoryPersistence.Configure(config)
	c.persister.Configure(config)
}
