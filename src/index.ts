#!/usr/bin/env node
import { version } from "../package.json";
import { soosLogger } from "@soos-io/api-client";
import { exit } from "process";
import { obfuscateProperties } from "@soos-io/api-client/dist/utilities";
import ContributorAuditArgumentParser, {
  IContributorAuditArguments,
} from "./services/ContributorAuditArgumentParser";
import { IBitBucketContributorAuditArguments, IGitHubContributorAuditArguments } from "./services";
import ContributorAuditService from "./services/ContributorAuditService/ContributorAuditService";
import { ScmType } from "./enums";

class SOOSContributorAudit {
  constructor(private args: IContributorAuditArguments) {}

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

    contributingDeveloperService.saveResults(contributingDevelopers, this.args.resultsFormat);
  }

  static async createAndRun(): Promise<void> {
    try {
      const contributorAuditArgumentParser = ContributorAuditArgumentParser.create();
      const args = contributorAuditArgumentParser.parseArguments<IContributorAuditArguments>();
      soosLogger.setMinLogLevel(args.logLevel);
      soosLogger.always("Starting SOOS SCM Contributor Audit");
      soosLogger.debug(
        JSON.stringify(
          obfuscateProperties(args as unknown as Record<string, unknown>, ["apiKey", "secret"]),
          null,
          2,
        ),
      );

      const soosContributorAudit = new SOOSContributorAudit(args);
      await soosContributorAudit.runAudit();
    } catch (error) {
      soosLogger.error(error);
      exit(1);
    }
  }
}

SOOSContributorAudit.createAndRun();
