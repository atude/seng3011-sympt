# Sympt 

[Webapp](sympt-app.herokuapp.com) | [API](sympt-server.herokuapp.com) | [Swagger Documentation](sympt-swagger.herokuapp.com/docs/)

## About

[WIP]

### Sympt API

This API enables users to return a list of disease reports according to search criteria found from [promedmail.org/](promedmail.org/).

### Sympt App

[WIP]


## Local Setup
### Requirements

- Node 12

### Setting up

1. Make a copy of `.env.example` in `./server` and rename it to `.env`.
2. Add the necessary keys to the `.env` file.
3. Run `npm run build` from root directory.
4. Run `npm start` to start the webapp *`(localhost:3000)`* and server *`(localhost:4000)`* concurrently.



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
