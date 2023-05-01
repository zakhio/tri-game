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

## Deployment

Server is running on rootless containers via podman. The pod definition can be found in 
`deployment/prod` folder.  

Helpful links:

* [How To Secure Nginx with Let's Encrypt on CentOS 8][2]
* [How to run Kubernetes workloads in systemd with Podman][3]
* [Enabling and disabling systemd services][4]


[1]: https://github.com/swagger-api/swagger-codegen#homebrew
[2]: https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-centos-8
[3]: https://www.redhat.com/sysadmin/kubernetes-workloads-podman-systemd
[4]: https://documentation.suse.com/smart/systems-management/html/reference-systemctl-enable-disable-services/index.html