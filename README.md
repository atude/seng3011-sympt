### For Developers 
---
#### Requirements

- Node 12

#### Setting up on your local machine

1. Copy the private service accounts file into the 'server' folder.
2. Run `npm run setup-all` from root directory.
3. Run `npm start` to start the server and app.

### Scripts
---
#### Root
| Script                      | Description                                                                 |
| --------------------------- | --------------------------------------------------------------------------- |
| `npm run setup-all`         | Reset and rebuild both server and web directories.                          |
| `npm start`                 | Start both server and app.                                                  |
| `npm run lint-check-all`    | Check linting for both server and app.                                      |
| `npm run lint-fix-all`      | Fix linting that can be automatically changed for both server and app.      |

#### Server *(cd server)*
| Script                      | Description                                                                 |
| --------------------------- | --------------------------------------------------------------------------- |
| `npm run setup`             | Reset and build server.                                                     |
| `npm run build`             | Compile TS into JS.                                                         |
| `npm start`                 | Compile and start server.                                                   |
| `npm run lint-check`        | Check linting for server.                                                   |
| `npm run lint-fix`          | Fix auto-fixable linting for server.                                        |

#### Web *(cd web)*
[WIP]
