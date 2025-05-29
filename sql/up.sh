#!/bin/bash

# PGPASSWORD=postgres psql -U postgres -h localhost -p 5432
PGPASSWORD=postgres psql -U postgres -h localhost -p 5432 mydb -f ./create.sql
PGPASSWORD=postgres psql -U postgres -h localhost -p 5432 mydb -f ./dataCreate.sql
