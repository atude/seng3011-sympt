# Sympt [WIP]

This API enables users to return a list of disease reports according to search criteria found from [promedmail.org/](promedmail.org/).

This repository contains:

* API design details 

* Project management information

* Swagger documentation + API endpoint which can be found at [sympt-swagger.herokuapp.com/docs/](sympt-swagger.herokuapp.com/docs/)

## Local Setup
### Requirements

- Node 12

### Setting up

1. Rename `.env.example` in `./server` to `.env` and add necessary keys.
2. Run `npm run build` from root directory.
3. Run `npm start` to start the webapp *`(localhost:3000)`* and server *`(localhost:4000)`* concurrently.



## Scripts
### Root
| Script                      | Description                                                                 |
| --------------------------- | --------------------------------------------------------------------------- |
| `npm run build`         | Reset and rebuild both server and web directories.                          |
| `npm run build:server`      | Reset and rebuild server.                                                   |
| `npm run build:web`         | Reset and rebuild web.                                                      |
| `npm run lint:check`        | Check linting for both server and app.                                      |
| `npm run lint:fix`          | Fix linting that can be automatically changed for both server and app.      |
| `npm start`                 | Start both server and app concurrently (dev mode).                                     |

### Server *(cd server)*
| Script                      | Description                                                                 |
| --------------------------- | --------------------------------------------------------------------------- |
| `npm run build`             | Reset and build server.                                                     |
| `npm run lint:check`        | Check linting for server.                                                   |
| `npm run lint:fix`          | Fix auto-fixable linting for server.                                        |
| `npm run start:dev`         | Start the server with hot reloading (not compiled).                                                   |
| `npm start`                 | Compile and start the server.                                     |

### Web *(cd web)*
| Script                      | Description                                                                 |
| --------------------------- | --------------------------------------------------------------------------- |
| `npm run build`             | Reset and build webapp.                                                     |
| `npm run lint:check`        | Check linting for webapp.                                                   |
| `npm run lint:fix`          | Fix auto-fixable linting for webapp.                                        |
| `npm start`                 | Compile and start webapp.                                                   |
