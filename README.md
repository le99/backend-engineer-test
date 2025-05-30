# Backend test

## Tecnologias

* AWS Cognito, con OAuth 2 para Node.js
* node v22.14.0
* PostgreSQL 15.12
* [Geoapify](<https://apidocs.geoapify.com/docs/geocoding/forward-geocoding/>)

# Correr con Docker compose

Crear un archivo .env con las vairables de entorno como en .env.sample

```bash
docker compose build
docker compose up

#Parar
docker compose down
```

Pagina:
<http://localhost:5173/>

PGAdmin

* url: <http://localhost:5050/browser/>
* DB url: postgres_container:5432
* DB user: postgres
* DB pwd: pwd

# Correr localmente

```bash
npm install
npm start
```

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
