# [SOOS](https://soos.io/)
The SOOS SCM Audit script should be used to determine the number of contributing developers in your organization.

## SOOS Badge Status
[![Dependency Vulnerabilities](https://img.shields.io/endpoint?url=https%3A%2F%2Fapi-hooks.soos.io%2Fapi%2Fshieldsio-badges%3FbadgeType%3DDependencyVulnerabilities%26pid%3Dzau3ko1vn%26branchName%3Dmain)](https://app.soos.io)
[![Out Of Date Dependencies](https://img.shields.io/endpoint?url=https%3A%2F%2Fapi-hooks.soos.io%2Fapi%2Fshieldsio-badges%3FbadgeType%3DOutOfDateDependencies%26pid%3Dzau3ko1vn%26branchName%3Dmain)](https://app.soos.io)

## Requirements
  - [Node 20 LTS](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
  
## Installation
run `npm install --prefix ./soos @soos-io/soos-scm-audit`

## Configure and Run the Script
NOTE: you can find values for the `--apiKey` and `--clientId` at [app.soos.io](https://app.soos.io/integrate).

### For GitHub
1. Generate a GitHub Public Access Token (PAT) for your organization and ensure that it has the full `repo` permission set.
![image](https://github.com/soos-io/soos-scm-audit/assets/88005582/0a437929-dd75-4a6d-b701-16173435c01d)

2. Plug in the values for `--apiKey`, `--clientId`, `--secret`, and `--organizationName` and run the script.

3. Run
`node ./soos/node_modules/@soos-io/soos-scm-audit/bin/index.js --apiKey=<API_KEY> --clientId=<CLIENT_ID> --scmType=GitHub --secret=<GITHUB_PAT> --organizationName="<GITHUB_ORG_NAME>"`

### For Bitbucket Cloud
1. Generate an App Password for your organization and ensure that it has the Read `Repositories` permission set.
![image](https://github.com/soos-io/soos-scm-audit/assets/92373106/7a2016d9-2dc2-45d2-9489-7fc78adaecfb)


2. Plug in the values for `--apiKey`, `--clientId`, `--secret`, and `--workspace`, and `--username` and run the script.

3. Run
`node ./soos/node_modules/@soos-io/soos-scm-audit/bin/index.js --apiKey=<API_KEY> --clientId=<CLIENT_ID> --scmType=BitbucketCloud --secret=<APP_PASSWORD> --workspace="<BITBUCKET_WORKSPACE>" --username="<BITBUCKET_USERNAME>"`


## Parameters

| General Parameters     | Default | Description                                              |
|------------------------|---------|----------------------------------------------------------|
| --apiKey               |         | SOOS API Key - get yours from SOOS Integration. Uses SOOS_API_KEY env value if present. |
| --clientId             |         | SOOS Client ID - get yours from SOOS Integration. Uses SOOS_API_CLIENT env value if present. |
| --logLevel             |         | Minimum level to show logs: DEBUG, INFO, WARN, FAIL, ERROR. |
| --saveResults          |         | Save results to file.                                    |
| --scmType              |         | Scm Type to use for the audit. Options: GitHub, BitBucketCloud          |

| BitBucket Cloud Parameters | Default | Description                                              |
|----------------------------|---------|----------------------------------------------------------|
| --username                 |         | Username where the App password was generated for BitBucketCloud. |
| --secret                   |         | Secret to use for API calls. It should be a App Password            |
| --workspace                |         | Workspace name to run audit for BitBucketCloud.          |

| GitHub Parameters          | Default | Description                                              |
|----------------------------|---------|----------------------------------------------------------|
| --organizationName         |         | Organization name to run audit for GitHub.               |
| --secret                   |         | Secret to use for API calls. It should be a GPAT            |
