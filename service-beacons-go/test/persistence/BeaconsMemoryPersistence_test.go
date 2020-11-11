package test_persistence

import (
	"testing"

	persist "github.com/nov-pocs/samples/service-beacons-go/persistence"
	cconf "github.com/pip-services3-go/pip-services3-commons-go/config"
)

type BeaconsMemoryPersistenceTest struct {
	persistence *persist.BeaconsMemoryPersistence
	fixture     *BeaconsPersistenceFixture
}

func NewBeaconsMemoryPersistenceTest() *BeaconsMemoryPersistenceTest {
	var persistence *persist.BeaconsMemoryPersistence
	var fixture *BeaconsPersistenceFixture

	persistence = persist.NewBeaconsMemoryPersistence()
	persistence.Configure(cconf.NewEmptyConfigParams())
	fixture = NewBeaconsPersistenceFixture(persistence)

	return &BeaconsMemoryPersistenceTest{
		persistence: persistence,
		fixture:     fixture,
	}
}

func (c *BeaconsMemoryPersistenceTest) Setup(t *testing.T) {
	err := c.persistence.Open("")
	if err != nil {
		t.Error("Failed to open persistence", err)
	}

	err = c.persistence.Clear("")
	if err != nil {
		t.Error("Failed to clear persistence", err)
	}
}

func (c *BeaconsMemoryPersistenceTest) Teardown(t *testing.T) {
	err := c.persistence.Close("")
	if err != nil {
		t.Error("Failed to close persistence", err)
	}
}

func TestBeaconsMemoryPersistence(t *testing.T) {
	c := NewBeaconsMemoryPersistenceTest()
	if c == nil {
		return
	}

	c.Setup(t)
	t.Run("CRUD Operations", c.fixture.TestCrudOperations)
	c.Teardown(t)

	c.Setup(t)
	t.Run("Get With Filters", c.fixture.TestGetWithFilters)
	c.Teardown(t)
}
