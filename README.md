> Sympt comprises of an Android application and an API, detailed below.

> [API Documentation](http://sympt-swagger.herokuapp.com/docs/) | [Developer Dashboard](http://symptdev.netlify.com)

## Our Team

- [Mozamel Anwary](https://github.com/atude): Technical Lead
- [Mariya Shmalko](https://github.com/et-cetra): Team Lead
- [Matthew Freeman](https://github.com/matthewdfreeman): Fullstack Developer
- [Annabel Zhou](https://github.com/annabelzh): Frontend Developer, Designer
- [Paul Grace](https://github.com/PaulGrace1200): Feature Developer

## Sympt

### Sympt App

Sympt is a centralised platform to provide up-to-date analytics and information about diseases in Australia, and focused on the COVID-19 pandemic. We provide users with data for diseases cases across Australian states, the rate of new cases, and the ability to use a timeline to see the growth and future predictions of diseases. Additionally, users can view an interactive map for a heatmap of COVID-19 cases across NSW where they can search (or use their location) to get information about the current number of total cases as well as the amount of predicted cases in the future. Our prediction algorithms use past trends of COVID-19 and region-specific population data to estimate the growth of the disease up to 30 days into the future, with the ability to examine different trends based on whether social distancing rules are enforced or not. This is packaged in an intuitive, beautiful and dynamic interface with visual graphs and coloured maps to make identifying trends and shifts in the disease climate easily digestable.

### [Sympt Developer Dashboard](http://symptdev.netlify.com)

The Sympt developer dashboard allows users to sign up for an account and gain access to a portion of our API. 
Using the dashboard, you can track your API call log with details about queries and errors, as well as visually analyse your usage overtime.
The API exposes users with our articles report endpoints to retrieve a list of disease reports according to search criteria found from [promedmail.org](http://promedmail.org). [Visit the documentation](http://symptdev.netlify.com) for more information about using the API endpoints.

### Sources and further information

Our data is sourced from various official outlets, including:

- [NNDSS (National Notifiable Diseases Surveillance System)](http://www9.health.gov.au/cda/source/cda-index.cfm)
- [data.NSW](https://data.nsw.gov.au/)
- [NSW Goverment Health](https://www.health.nsw.gov.au/)
- [ABS (Australian Bureau of Statistics)](https://www.abs.gov.au/)
- [ProMed Mail](http://promedmail.org)

Our predictions are derived using the [SIR (Susceptible/Infectious/Recovered)](https://en.wikipedia.org/wiki/Compartmental_models_in_epidemiology) disease transmission model.

For more information about our design, test and build process, view our detailed documentation reports [here](https://github.com/atude/seng3011-sympt/tree/master/_docs/reports).

## Local Setup
### Requirements

- Node 12
- Expo + Expo CLI

### Setting up

#### API and Dashboard

1. Make a copy of `.env.example` in `./server` and rename it to `.env`.
1. Make a copy of `.env.example` in `./web` and rename it to `.env`.
1. Add the necessary keys to both `server` and `web` `.env` files.
1. Run `npm run build` from root directory.
1. Run `npm start` to start the developer dashboard webapp *`(localhost:3000)`* and API server *`(localhost:4000)`* concurrently.

#### App

1. Make a copy of `.env.example` in `./app` and rename it to `.env`.
1. Make a copy of `app.json.example` in `./app` and rename it to `app.json`.
1. Add the necessary keys to the `.env` and `app.json` files.
1. `cd ./app`
1. Run `expo install` to setup necessary dependencies.
1. Run `expo start` to start the development server.
1. Open AVD and run the Expo app on a virtual device using `Local` mode, and copy the connection address to the Expo app.
1. *(Optionally)* Open the Expo app on a mobile device and scan the QR code (or send an access email) on `LAN` or `Tunnel` mode.


## Scripts

### App
| Script                      | Description                                                                 |
| --------------------------- | --------------------------------------------------------------------------- |
| `expo install`              | Install necessary dependencies using npm (with expo compatible packages if available). |
| `expo start`                | Start the development server.                                               |

[See here for further details on building a standalone app using Expo.](https://docs.expo.io/distribution/building-standalone-apps/)

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
