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
(cd frontend && npm run generate-rest-client)
```

[1]: https://github.com/swagger-api/swagger-codegen#homebrew