# Tracker
CRUD app for tracks.

## Installation
- docker-compose up -d
- docker-compose exec php php bin/console doctrine:migrations:migrate -n
- docker-compose exec php php bin/console doctrine:fixtures:load -n
- docker-compose exec php php bin/console lexik:jwt:generate-keypair
