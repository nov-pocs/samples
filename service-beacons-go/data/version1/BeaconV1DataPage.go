package data1

type BeaconV1DataPage struct {
	Total *int64      `json:"total" bson:"total"`
	Data  []*BeaconV1 `json:"data" bson:"data"`
}

func NewEmptyBeaconV1DataPage() *BeaconV1DataPage {
	return &BeaconV1DataPage{}
}

func NewBeaconV1DataPage(total *int64, data []*BeaconV1) *BeaconV1DataPage {
	return &BeaconV1DataPage{Total: total, Data: data}
}
