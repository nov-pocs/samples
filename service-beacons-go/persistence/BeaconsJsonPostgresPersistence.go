package persistence

import (
	"context"
	"reflect"
	"strings"

	data1 "github.com/nov-pocs/samples/service-beacons-go/data/version1"
	cdata "github.com/pip-services3-go/pip-services3-commons-go/data"
	cpersist "github.com/pip-services3-go/pip-services3-postgres-go/persistence"
)

type BeaconsJsonPostgresPersistence struct {
	cpersist.IdentifiableJsonPostgresPersistence
}

func NewBeaconsJsonPostgresPersistence() *BeaconsJsonPostgresPersistence {
	proto := reflect.TypeOf(&data1.BeaconV1{})
	c := &BeaconsJsonPostgresPersistence{
		IdentifiableJsonPostgresPersistence: *cpersist.NewIdentifiableJsonPostgresPersistence(proto, "beacons_json"),
	}
	c.EnsureTable("VARCHAR(32)", "JSONB")
	c.EnsureIndex("beacons_json_site_id", map[string]string{"(data->>'site_id')": "1"}, map[string]string{})
	return c
}

func (c *BeaconsJsonPostgresPersistence) composeFilter(filter *cdata.FilterParams) interface{} {
	if filter == nil {
		filter = cdata.NewEmptyFilterParams()
	}

	var criteria []string

	id := filter.GetAsString("id")
	if id != "" {
		criteria = append(criteria, "data->>'id'='"+id+"'")
	}

	siteId := filter.GetAsString("site_id")
	if siteId != "" {
		criteria = append(criteria, "data->>'site_id'='"+siteId+"'")
	}

	label := filter.GetAsString("label")
	if label != "" {
		criteria = append(criteria, "data->>'label'='"+label+"'")
	}

	udi := filter.GetAsString("udi")
	if udi != "" {
		criteria = append(criteria, "data->>'udi'='"+udi+"'")
	}

	udis := filter.GetAsString("udis")
	if udis != "" {
		udiValues := strings.Split(udis, ",")
		if len(udiValues) > 1 {
			condition := "data->>'udi' IN ('" + strings.Join(udiValues, "','") + "')"
			criteria = append(criteria, condition)
		}
	}

	if len(criteria) == 0 {
		return ""
	}

	return strings.Join(criteria, " AND ")
}

func (c *BeaconsJsonPostgresPersistence) GetPageByFilter(correlationId string, filter *cdata.FilterParams, paging *cdata.PagingParams) (*data1.BeaconV1DataPage, error) {
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

func (c *BeaconsJsonPostgresPersistence) GetOneById(correlationId string, id string) (*data1.BeaconV1, error) {
	result, err := c.IdentifiablePostgresPersistence.GetOneById(correlationId, id)

	if result == nil || err != nil {
		return nil, err
	}

	// Convert to BeaconV1
	item, _ := result.(*data1.BeaconV1)
	return item, err
}

func (c *BeaconsJsonPostgresPersistence) GetOneByUdi(correlationId string, udi string) (*data1.BeaconV1, error) {
	query := "SELECT * FROM " + c.QuoteIdentifier(c.TableName) + " WHERE data->>'udi'=$1 LIMIT 1"

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

func (c *BeaconsJsonPostgresPersistence) Create(correlationId string, item *data1.BeaconV1) (*data1.BeaconV1, error) {
	result, err := c.IdentifiablePostgresPersistence.Create(correlationId, item)

	if result == nil || err != nil {
		return nil, err
	}

	// Convert to BeaconV1
	item, _ = result.(*data1.BeaconV1)
	return item, err
}

func (c *BeaconsJsonPostgresPersistence) Update(correlationId string, item *data1.BeaconV1) (*data1.BeaconV1, error) {
	result, err := c.IdentifiablePostgresPersistence.Update(correlationId, item)

	if result == nil || err != nil {
		return nil, err
	}

	// Convert to BeaconV1
	item, _ = result.(*data1.BeaconV1)
	return item, err
}

func (c *BeaconsJsonPostgresPersistence) DeleteById(correlationId string, id string) (*data1.BeaconV1, error) {
	result, err := c.IdentifiablePostgresPersistence.DeleteById(correlationId, id)

	if result == nil || err != nil {
		return nil, err
	}

	// Convert to BeaconV1
	item, _ := result.(*data1.BeaconV1)
	return item, err
}
