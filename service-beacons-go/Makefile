
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
	./protogen.ps1

docgen: env go.sum
	./docgen.ps1