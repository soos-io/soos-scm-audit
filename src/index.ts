#!/usr/bin/env node
import { version } from "../package.json";
import {
  IBitBucketContributorAuditArguments,
  IGitHubContributorAuditArguments,
  ScmType,
  soosLogger,
} from "@soos-io/api-client";
import { exit } from "process";
import { obfuscateProperties } from "@soos-io/api-client/dist/utilities";
import ContributorAuditService from "@soos-io/api-client/dist/services/ContributorAuditService/ContributorAuditService";
import ContributorAuditArgumentParser, {
  IContributorAuditArguments,
} from "@soos-io/api-client/dist/services/ContributorAuditArgumentParser";

class SOOSSCMAudit {
  constructor(private args: IContributorAuditArguments) {}

  static parseArgs(): IContributorAuditArguments {
    const contributorAuditArgumentParser = ContributorAuditArgumentParser.create();

    soosLogger.info("Parsing arguments");
    return contributorAuditArgumentParser.parseArguments();
  }

  async runAudit(): Promise<void> {
    const contributingDeveloperService = ContributorAuditService.create(
      this.args.apiKey,
      this.args.apiURL,
      this.args.scmType,
    );
    let auditParams;

    if (this.args.scmType === ScmType.GitHub) {
      const githubArgs = this.args as IGitHubContributorAuditArguments;
      auditParams = {
        days: this.args.days,
        scriptVersion: version,
        organizationName: githubArgs.organizationName,
        secret: this.args.secret,
      };
    } else if (this.args.scmType === ScmType.BitbucketCloud) {
      const bitbucketCloudArgs = this.args as IBitBucketContributorAuditArguments;
      auditParams = {
        days: this.args.days,
        scriptVersion: version,
        secret: this.args.secret,
        username: bitbucketCloudArgs.username,
        workspace: bitbucketCloudArgs.workspace,
      };
    } else {
      soosLogger.error(`Unsupported SCM type: ${this.args.scmType}`);
      exit(1);
    }

    soosLogger.info(`Running Contributing Developer audit for ${this.args.scmType}`);
    const contributingDevelopers = await contributingDeveloperService.audit(auditParams);

    await contributingDeveloperService.uploadContributorAudits(
      this.args.clientId,
      contributingDevelopers,
    );

    contributingDeveloperService.saveResults(contributingDevelopers, this.args.saveResults);
  }

  static async createAndRun(): Promise<void> {
    soosLogger.info("Starting SOOS SCM Contributor Audit");
    soosLogger.logLineSeparator();
    try {
      const args = this.parseArgs();
      soosLogger.setMinLogLevel(args.logLevel);
      soosLogger.debug(
        JSON.stringify(
          obfuscateProperties(args as unknown as Record<string, unknown>, ["apiKey", "secret"]),
          null,
          2,
        ),
      );
      soosLogger.logLineSeparator();
      const soosSCMAudit = new SOOSSCMAudit(args);
      await soosSCMAudit.runAudit();
    } catch (error) {
      soosLogger.error(`Error on createAndRun: ${error}`);
      exit(1);
    }
  }
}

SOOSSCMAudit.createAndRun();
