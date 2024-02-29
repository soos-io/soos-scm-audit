# [SOOS](https://soos.io/)
The SOOS SCM Audit script should be used to determine the number of contributing developers in your organization.

## Requirements
  - [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
  
## Installation
You may choose to install the package globally or locally, if you are unsure, you can find out more about installing globally on [npm](https://docs.npmjs.com/downloading-and-installing-packages-globally).

### Globally
run `npm i -g @soos-io/soos-scm-audit@latest`

### Locally
run `npm install --prefix ./soos @soos-io/soos-scm-audit`

## Configure and Run the Script
NOTE: you can find values for the `--apiKey` and `--clientId` at [app.soos.io](https://app.soos.io/integrate).

### For GitHub
1. Generate a GitHub Public Access Token (PAT) for your organization and ensure that it has the full `repo` permission set.
![image](https://github.com/soos-io/soos-scm-audit/assets/88005582/0a437929-dd75-4a6d-b701-16173435c01d)

2. Plug in the values for `--apiKey`, `--clientId`, `--secret`, and `--organizationName` and run the script.

#### When Installed Globally:
`soos-scm-audit --apiKey=<API_KEY> --clientId=<CLIENT_ID> --scmType=GitHub --secret=<GITHUB_PAT> --organizationName="<GITHUB_ORG_NAME>"`

#### When Installed Locally:
`node ./soos/node_modules/@soos-io/soos-scm-audit/bin/index.js --apiKey=<API_KEY> --clientId=<CLIENT_ID> --scmType=GitHub --secret=<GITHUB_PAT> --organizationName="<GITHUB_ORG_NAME>"`


## Parameters

| Argument                | Default                                   | Description                                                                                                                          |
| ----------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `--apiKey`              |  | SOOS API Key - get yours from [SOOS Integration](https://app.soos.io/integrate/sca). Uses `SOOS_API_KEY` env value if present.      |
| `--clientId`            |  | SOOS Client ID - get yours from [SOOS Integration](https://app.soos.io/integrate/sca). Uses `SOOS_API_CLIENT` env value if present.                                           |                                                                                       |
| `--logLevel` |  | Minimum level to show logs: DEBUG INFO, WARN, FAIL, ERROR. |
| `--saveResults`         |                                        | Save results to file.
| `--scmType`         |                                        | Scm Type to use for the audit. Options: GitHub.
| `--secret`         |                                        | Secret to use for api calls, for GitHub it should be a GPAT, and for BitBucketCloud a App Password.                                                                 |
| `--organizationName`         |                                        | Organization name to run audit for GitHub.                                                                     |
| `--username`         |                                        | Username where the App password was generated for BitBucketCloud.                                                                     |
| `--workspace`         |                                        | Workspace name to run audit for BitBucketCloud.                                                                     |
| `--verbose`             | `false`                                   | Enable verbose logging.                                                                                                             |
