#!/bin/bash

# PGPASSWORD=postgres psql -U postgres -h localhost -p 5432
PGPASSWORD=postgres psql -U postgres -h localhost -p 5432 mydb -f ./delete.sql
PGPASSWORD=postgres psql -U postgres -h localhost -p 5432 mydb -f ./dataDelete.sql
