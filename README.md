# [SOOS](https://soos.io/)
The SOOS SCM Audit script should be used to determine the number of contributing developers in your organization.

## Requirements
  - [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
  
## Installation
You may choose to install the package globally or locally, if you are unsure, you can find out more about installing globally on [npm](https://docs.npmjs.com/downloading-and-installing-packages-globally).

### Globally
run `npm i -g @soos-io/soos-scm-audit@latest`
Then Run `soos-scm-audit` from any terminal and add the parameters you want.

### Locally
run `npm install --prefix ./soos @soos-io/soos-scm-audit`
Then run from the same terminal `node ./soos/node_modules/@soos-io/soos-scm-audit/bin/index.js`

### Run the Script
NOTE: you can get the SOOS `ApiKey` and `ClientId` from [app.soos.io](https://app.soos.io/integrate).
`npm @soos... --apiKey`


## Client Parameters

| Argument                | Default                                   | Description                                                                                                                          |
| ----------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `--apiKey`              |  | SOOS API Key - get yours from [SOOS Integration](https://app.soos.io/integrate/sca). Uses `SOOS_API_KEY` env value if present.      |
| `--clientId`            |  | SOOS Client ID - get yours from [SOOS Integration](https://app.soos.io/integrate/sca). Uses `SOOS_API_CLIENT` env value if present.                                           |                                                                                       |
| `--logLevel` |  | Minimum level to show logs: DEBUG INFO, WARN, FAIL, ERROR. |
| `--saveResults`         |                                        | Save results to file.
| `--scmType`         |                                        | Scm Type to use for the audit. Options: GitHub.
| `--secret`         |                                        | Secret to use for api calls, for example when --scmType=GitHub this needs to have the value of a PAT.                                                                 |
| `--organizationName`         |                                        | Organization name to run audit.                                                                     |
| `--verbose`             | `false`                                   | Enable verbose logging.                                                                                                             |
