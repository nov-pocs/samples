package persistence

import (
	"context"
	"reflect"
	"strings"

	data1 "github.com/nov-pocs/samples/service-beacons-go/data/version1"
	cdata "github.com/pip-services3-go/pip-services3-commons-go/data"
	cpersist "github.com/pip-services3-go/pip-services3-postgres-go/persistence"
)

type BeaconsPostgresPersistence struct {
	cpersist.IdentifiablePostgresPersistence
}

func NewBeaconsPostgresPersistence() *BeaconsPostgresPersistence {
	proto := reflect.TypeOf(&data1.BeaconV1{})
	c := &BeaconsPostgresPersistence{
		IdentifiablePostgresPersistence: *cpersist.NewIdentifiablePostgresPersistence(proto, "beacons"),
	}
	// Row name must be in double quotes for properly case!!!
	c.AutoCreateObject("CREATE TABLE \"beacons\" (\"id\" TEXT PRIMARY KEY, \"site_id\" TEXT, \"type\" TEXT, \"udi\" TEXT, \"label\" TEXT, \"center\" JSONB, \"radius\" REAL)")
	c.EnsureIndex("beacons_site_id", map[string]string{"site_id": "1"}, map[string]string{})
	return c
}

func (c *BeaconsPostgresPersistence) composeFilter(filter *cdata.FilterParams) interface{} {
	if filter == nil {
		filter = cdata.NewEmptyFilterParams()
	}

	var criteria []string

	id := filter.GetAsString("id")
	if id != "" {
		criteria = append(criteria, "\"id\"='"+id+"'")
	}

	siteId := filter.GetAsString("site_id")
	if siteId != "" {
		criteria = append(criteria, "\"site_id\"='"+siteId+"'")
	}

	label := filter.GetAsString("label")
	if label != "" {
		criteria = append(criteria, "\"label\"='"+label+"'")
	}

	udi := filter.GetAsString("udi")
	if udi != "" {
		criteria = append(criteria, "\"udi\"='"+udi+"'")
	}

	udis := filter.GetAsString("udis")
	if udis != "" {
		udiValues := strings.Split(udis, ",")
		if len(udiValues) > 1 {
			condition := "\"udi\" IN ('" + strings.Join(udiValues, "','") + "')"
			criteria = append(criteria, condition)
		}
	}

	if len(criteria) == 0 {
		return ""
	}

	return strings.Join(criteria, " AND ")
}

func (c *BeaconsPostgresPersistence) GetPageByFilter(correlationId string, filter *cdata.FilterParams, paging *cdata.PagingParams) (*data1.BeaconV1DataPage, error) {
	tempPage, err := c.IdentifiablePostgresPersistence.GetPageByFilter(correlationId, c.composeFilter(filter), paging, nil, nil)

	// Convert to BeaconsV1Page
	dataLen := int64(len(tempPage.Data))
	data := make([]*data1.BeaconV1, dataLen)
	for i, v := range tempPage.Data {
		data[i] = v.(*data1.BeaconV1)
	}
	page := data1.NewBeaconV1DataPage(&dataLen, data)

	return page, err
}

func (c *BeaconsPostgresPersistence) GetOneById(correlationId string, id string) (*data1.BeaconV1, error) {
	result, err := c.IdentifiablePostgresPersistence.GetOneById(correlationId, id)

	if result == nil || err != nil {
		return nil, err
	}

	// Convert to BeaconV1
	item, _ := result.(*data1.BeaconV1)
	return item, err
}

func (c *BeaconsPostgresPersistence) GetOneByUdi(correlationId string, udi string) (*data1.BeaconV1, error) {
	query := "SELECT * FROM " + c.QuoteIdentifier(c.TableName) + " WHERE \"udi\"=$1 LIMIT 1"

	result, err := c.Client.Query(context.TODO(), query, udi)
	if err != nil {
		return nil, err
	}

	defer result.Close()

	if !result.Next() {
		return nil, result.Err()
	}

	val := c.ConvertToPublic(result)
	item, _ := val.(*data1.BeaconV1)

	if item == nil {
		c.Logger.Trace(correlationId, "Nothing found from %s with udi = %s", c.TableName, udi)
	} else {
		c.Logger.Trace(correlationId, "Retrieved from %s with udi = %s", c.TableName, udi)
	}

	return item, nil
}

func (c *BeaconsPostgresPersistence) Create(correlationId string, item *data1.BeaconV1) (*data1.BeaconV1, error) {
	result, err := c.IdentifiablePostgresPersistence.Create(correlationId, item)

	if result == nil || err != nil {
		return nil, err
	}

	// Convert to BeaconV1
	item, _ = result.(*data1.BeaconV1)
	return item, err
}

func (c *BeaconsPostgresPersistence) Update(correlationId string, item *data1.BeaconV1) (*data1.BeaconV1, error) {
	result, err := c.IdentifiablePostgresPersistence.Update(correlationId, item)

	if result == nil || err != nil {
		return nil, err
	}

	// Convert to BeaconV1
	item, _ = result.(*data1.BeaconV1)
	return item, err
}

func (c *BeaconsPostgresPersistence) DeleteById(correlationId string, id string) (*data1.BeaconV1, error) {
	result, err := c.IdentifiablePostgresPersistence.DeleteById(correlationId, id)

	if result == nil || err != nil {
		return nil, err
	}

	// Convert to BeaconV1
	item, _ := result.(*data1.BeaconV1)
	return item, err
}
