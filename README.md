# Backend test

## Tecnologias

* AWS Cognito
* node v22.14.0
* PostgreSQL 15.12
* [Geoapify](<https://apidocs.geoapify.com/docs/geocoding/forward-geocoding/>)

```bash
npm install
npm start
```

Se deben poner las variables de entorno como se muestra .env.sample

Pruebas

```bash
npm run test
```

# API routes

* /api/restaurant?lon=-74.05546427741899&lat=4.692597149999999
* /api/restaurant?city=bogota
* /api/transaction?url=signin

AWS Cognito:

* /api/auth/login
* /api/auth/signedin
* /api/auth/signout
* /api/auth/signedout

# Docker compose

PGAdmin
<http://localhost:5050/browser/>
postgres_container:5432
postgres
pwd
