# [SOOS](https://soos.io/)

SOOS is an independent software security company, located in Winooski, VT USA, building security software for your team. [SOOS, Software security, simplified](https://soos.io).

Use SOOS to scan your software for [vulnerabilities](https://app.soos.io/research/vulnerabilities) and [open source license](https://app.soos.io/research/licenses) issues with [SOOS Core SCA](https://soos.io/products/sca). [Generate and ingest SBOMs](https://soos.io/products/sbom-manager). [Export reports](https://kb.soos.io/help/soos-reports-for-export) to industry standards. Govern your open source dependencies. Run the [SOOS DAST vulnerability scanner](https://soos.io/products/dast) against your web apps or APIs. [Scan your Docker containers](https://soos.io/products/containers) for vulnerabilities. Check your source code for issues with [SAST Analysis](https://soos.io/products/sast).

[Demo SOOS](https://app.soos.io/demo) or [Register for a Free Trial](https://app.soos.io/register).

If you maintain an Open Source project, sign up for the Free as in Beer [SOOS Community Edition](https://soos.io/products/community-edition).

## Requirements
  - [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
  
## Installation

### Globally
run `npm i -g @soos-io/soos-scm-audit@latest`
Then Run `soos-scm-audit` from any terminal and add the parameters you want.

### Locally
run `npm install --prefix ./soos @soos-io/soos-scm-audit`
Then run from the same terminal `node ./soos/node_modules/@soos-io/soos-scm-audit/bin/index.js`

## Client Parameters


| Argument                | Default                                   | Description                                                                                                                          |
| ----------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `--apiKey`              |  | SOOS API Key - get yours from [SOOS Integration](https://app.soos.io/integrate/). Uses `SOOS_API_KEY` env value if present.      |
| `--clientId`            |  | SOOS Client ID - get yours from [SOOS Integration](https://app.soos.io/integrate/). Uses `SOOS_API_CLIENT` env value if present.                                           |                                                                                       |
| `--logLevel` |  | Minimum level to show logs: DEBUG INFO, WARN, FAIL, ERROR. |
| `--saveResults`         |                                        | Save results to file.
| `--scmType`         |                                        | Scm Type to use for the audit. Options: GitHub.
| `--secret`         |                                        | Secret to use for api calls, for example when --scmType=GitHub this needs to have the value of a GPAT.                                                                 |
| `--organizationName`         |                                        | Organization name to run audit.                                                                     |
| `--verbose`             | `false`                                   | Enable verbose logging.                                                                                                             |