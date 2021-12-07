## Backend

## Installation

https://docs.docker.com/engine/install/fedora/

Before starting the docker, you need to enable it with:

sudo systemctl enable docker

## Start project

for start project on local use:
make dev

if you work with db and want to see changes use:
make clean dev

### Environment

| Name           | Description | Default |
| -------------- | ----------- | ------- |
| MYSQL_HOST     |             |         |
| MYSQL_USER     |             |         |
| MYSQL_PASSWORD |             |         |
| MYSQL_DBNAME   |             |         |
| BACKEND_PORT   |             |         |

For view table data:

entities: docker exec -it backend_mysql_1 mysql -u root -pqwerty stock -e "select hex(id), type,entity from entities"

triples: docker exec -it backend_mysql_1 mysql -u root -pqwerty stock -e "select id, hex(subject), predicate, hex(object), deleted from triples"
