
.PHONY: all build clean env install uninstall fmt simplify check run test protogen docgen

env:
	export GOPRIVATE=github.com/nov-pocs/*

install: env
	@go install ./bin/run.go

go.sum: env
	@go mod tidy

run: env go.sum
	@go run ./bin/run.go

test: env go.sum
	@go test -v ./test/...

protogen: env go.sum
	protoc --go_out=plugins=grpc:. protos/beacons_v1.proto

docgen: env go.sum
	gold -gen -nouses -dir=docs -emphasize-wdpkgs ./...