package data1

type GeoPointV1 struct {
	Type        string      `json:"type" bson:"type"`
	Coordinates [][]float32 `json:"coordinates" bson:"coordinates"`
}
