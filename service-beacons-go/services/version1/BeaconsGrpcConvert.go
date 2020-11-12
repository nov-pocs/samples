package services1

import (
	"encoding/json"

	data1 "github.com/nov-pocs/samples/service-beacons-go/data/version1"
	protos "github.com/nov-pocs/samples/service-beacons-go/protos"
	"github.com/pip-services3-go/pip-services3-commons-go/convert"
	"github.com/pip-services3-go/pip-services3-commons-go/errors"
)

func FromError(err error) *protos.ErrorDescription {
	if err == nil {
		return nil
	}

	desc := errors.ErrorDescriptionFactory.Create(err)
	obj := &protos.ErrorDescription{
		Category:      desc.Category,
		Code:          desc.Code,
		CorrelationId: desc.CorrelationId,
		Status:        convert.StringConverter.ToString(desc.Status),
		Message:       desc.Message,
		Cause:         desc.Cause,
		StackTrace:    desc.StackTrace,
		Details:       FromMap(desc.Details),
	}

	return obj
}

func ToError(obj *protos.ErrorDescription) error {
	if obj == nil || (obj.Category == "" && obj.Message == "") {
		return nil
	}

	description := &errors.ErrorDescription{
		Category:      obj.Category,
		Code:          obj.Code,
		CorrelationId: obj.CorrelationId,
		Status:        convert.IntegerConverter.ToInteger(obj.Status),
		Message:       obj.Message,
		Cause:         obj.Cause,
		StackTrace:    obj.StackTrace,
		Details:       ToMap(obj.Details),
	}

	return errors.ApplicationErrorFactory.Create(description)
}

func FromMap(val map[string]interface{}) map[string]string {
	r := map[string]string{}

	for k, v := range val {
		r[k] = convert.ToString(v)
	}
	return r
}

func ToMap(val map[string]string) map[string]interface{} {
	var r map[string]interface{}

	for k, v := range val {
		r[k] = v
	}
	return r
}

func ToJson(value interface{}) string {
	if value == nil {
		return ""
	}

	b, err := json.Marshal(value)
	if err != nil {
		return ""
	}
	return string(b[:])
}

func fromJson(value string) interface{} {
	if value == "" {
		return nil
	}

	var m interface{}
	json.Unmarshal([]byte(value), &m)
	return m
}

func FromBeacon(item *data1.BeaconV1) *protos.BeaconV1 {

	if item == nil {
		return nil
	}

	beacon := protos.BeaconV1{}
	beacon.Id = item.Id
	beacon.Udi = item.Udi
	beacon.Type = item.Type
	beacon.SiteId = item.SiteId
	beacon.Radius = item.Radius
	beacon.Label = item.Label
	beacon.Center = &protos.GeoPointV1{}
	beacon.Center.Type = item.Center.Type
	if item.Center.Coordinates != nil {
		for _, row := range item.Center.Coordinates {
			i := protos.InternalArray{}
			for _, val := range row {
				i.InternalArray = append(i.InternalArray, val)
			}
			beacon.Center.Coordinates = append(beacon.Center.Coordinates, &i)
		}
	}
	return &beacon
}

func ToBeacon(item *protos.BeaconV1) *data1.BeaconV1 {

	if item == nil {
		return nil
	}

	beacon := data1.BeaconV1{}
	beacon.Id = item.Id
	beacon.Udi = item.Udi
	beacon.Type = item.Type
	beacon.SiteId = item.SiteId
	beacon.Radius = item.Radius
	beacon.Label = item.Label
	if item.Center != nil {
		beacon.Center = data1.GeoPointV1{}
		beacon.Center.Type = item.Center.Type
		beacon.Center.Coordinates = make([][]float32, len(item.Center.Coordinates))
		for x, row := range item.Center.Coordinates {
			beacon.Center.Coordinates[x] = row.InternalArray
		}
	}
	return &beacon
}

func FromPosition(item *data1.GeoPointV1) *protos.GeoPointV1 {

	if item == nil {
		return nil
	}

	point := protos.GeoPointV1{}
	point.Type = item.Type

	for _, row := range item.Coordinates {
		i := protos.InternalArray{}
		for _, val := range row {
			i.InternalArray = append(i.InternalArray, val)
		}
		point.Coordinates = append(point.Coordinates, &i)
	}
	return &point
}

func ToPosition(item *protos.GeoPointV1) *data1.GeoPointV1 {

	if item == nil {
		return nil
	}

	point := data1.GeoPointV1{}
	point.Type = item.Type

	point.Type = item.Type
	point.Coordinates = make([][]float32, len(item.Coordinates))
	for x, row := range item.Coordinates {
		point.Coordinates[x] = row.InternalArray
	}
	return &point
}
