# Sympt

[API Documentation](http://sympt-swagger.herokuapp.com/docs/) | [Developer Dashboard](http://symptdev.netlify.com)

## About

[WIP]


### Sympt App

[WIP]

### [API Documentation](http://sympt-swagger.herokuapp.com/docs/)

This API enables users to retrieve a list of disease reports according to search criteria found from [promedmail.org/](http://promedmail.org/).

### [Developer Dashboard](http://symptdev.netlify.com)

The developer dashboard allows API users to sign up for a sympt API account and gain access to our API. 
From the dashboard, you can refresh your API token, track your API call log and visually analyse your API usage.


## Local Setup
### Requirements

- Node v12.X.X
- Expo & Expo CLI

### Setting up

#### API and Dashboard

1. Make a copy of `.env.example` in `./server` and rename it to `.env`.
1. Make a copy of `.env.example` in `./web` and rename it to `.env`.
1. Add the necessary keys to both `server` and `web` `.env` files.
1. Run `npm run build` from root directory.
1. Run `npm start` to start the developer dashboard webapp *`(localhost:3000)`* and API server *`(localhost:4000)`* concurrently.

#### App

1. Make a copy of `.env.example` in `./app` and rename it to `.env`.
1. Add the necessary keys to the `.env` file.


## Scripts

### App
| Script                      | Description                                                                 |
| --------------------------- | --------------------------------------------------------------------------- |
| `expo install`              | Install necessary dependencies using npm (with expo compatible packages if available). |
| `expo start`                | Start the development server.                                               |

### Root (For server and webapp)
| Script                      | Description                                                                 |
| --------------------------- | --------------------------------------------------------------------------- |
| `npm run build`             | Reset and rebuild both server and web directories.                          |
| `npm run build:server`      | Reset and rebuild server.                                                   |
| `npm run build:web`         | Reset and rebuild web.                                                      |
| `npm run lint:check`        | Check linting for both server and app.                                      |
| `npm run lint:fix`          | Fix linting that can be automatically changed for both server and app.      |
| `npm test`                  | Run all unit tests.                                                         |
| `npm start`                 | Start both server and app concurrently (dev mode).                          |

### Server 
| Script                      | Description                                                                 |
| --------------------------- | --------------------------------------------------------------------------- |
| `npm run build`             | Reset and build server.                                                     |
| `npm run lint:check`        | Check linting for server.                                                   |
| `npm run lint:fix`          | Fix auto-fixable linting for server.                                        |
| `npm run start:dev`         | Start the server with hot reloading (not compiled).                         |
| `npm test`                  | Run all server unit tests.                                                  |
| `npm start`                 | Compile and start the server.                                               |

### Web
| Script                      | Description                                                                 |
| --------------------------- | --------------------------------------------------------------------------- |
| `npm run build`             | Reset and build webapp.                                                     |
| `npm run lint:check`        | Check linting for webapp.                                                   |
| `npm run lint:fix`          | Fix auto-fixable linting for webapp.                                        |
| `npm start`                 | Compile and start webapp.                                                   |
