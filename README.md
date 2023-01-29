# Guess game TRI

Guess game TRI influenced by Codenames

## Local setup

To run the app just call

```shell
docker compose up --build
```

Note: `--build` is required in case of code changes to rebuild docker image for the service,
otherwise Docker would use cache version

## Re-generating frontend client sdk

The code for `frontend/src/api` is generated from swagger definition which generated from backend.
Swagger to TypeScript relies on [swagger-codegen][1] tool (do not forget to install it).

```shell
docker compose up -d redis
(cd backend && ./gradlew clean generateOpenApiDocs)
swagger-codegen generate -i backend/build/openapi.json -l typescript-fetch -o frontend/src/api/ && 
  rm -fR frontend/src/api/.swagger-codegen && rm frontend/src/api/.gitignore && 
  rm frontend/src/api/.swagger-codegen-ignore && rm frontend/src/api/git_push.sh &&
  rm frontend/src/api/api_test.spec.ts
```

[1]: https://github.com/swagger-api/swagger-codegen#homebrew