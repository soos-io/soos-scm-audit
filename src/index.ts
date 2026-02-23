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

const runAudit = async (args: IContributorAuditArguments): Promise<void> => {
  const contributingDeveloperService = ContributorAuditService.create(
    args.apiKey,
    args.apiURL,
    args.scmType,
  );
  let auditParams;

  if (args.scmType === ScmType.GitHub) {
    const githubArgs = args as IGitHubContributorAuditArguments;
    auditParams = {
      days: args.days,
      scriptVersion: version,
      organizationName: githubArgs.organizationName,
      secret: args.secret,
    };
  } else {
    const bitbucketCloudArgs = args as IBitBucketContributorAuditArguments;
    auditParams = {
      days: args.days,
      scriptVersion: version,
      secret: args.secret,
      username: bitbucketCloudArgs.username,
      workspace: bitbucketCloudArgs.workspace,
    };
  }

  soosLogger.info(`Running Contributing Developer audit for ${args.scmType}`);
  const contributingDevelopers = await contributingDeveloperService.audit(auditParams);

  await contributingDeveloperService.uploadContributorAudits(args.clientId, contributingDevelopers);

  contributingDeveloperService.saveResults(contributingDevelopers, args.resultsFormat);
};

(async (): Promise<void> => {
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

    await runAudit(args);
  } catch (error) {
    soosLogger.error(error);
    exit(1);
  }
})();
