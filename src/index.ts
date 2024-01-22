#!/usr/bin/env node
import { version } from "../package.json";
import { ScmType, soosLogger } from "@soos-io/api-client";
import { exit } from "process";
import {
  obfuscateProperties,
} from "@soos-io/api-client/dist/utilities";
import ContributorAuditService from '@soos-io/api-client/dist/services/ContributorAuditService/ContributorAuditService';
import ContributorAuditArgumentParser, { ICommonArguments } from "@soos-io/api-client/dist/services/ContributorAuditArgumentParser";

interface SOOSSCMAuditArgs extends ICommonArguments {
  days: number;
  secret: string;
  saveResults: boolean;
  scmType: ScmType;
  organizationName: string;
}

class SOOSSCMAudit { 
  constructor(private args: SOOSSCMAuditArgs) {}

  static parseArgs(): SOOSSCMAuditArgs {
    const contributorAuditArgumentParser = ContributorAuditArgumentParser.create();
    contributorAuditArgumentParser.addBaseContributorArguments(
      
    );

    soosLogger.info("Parsing arguments");
    return contributorAuditArgumentParser.parseArguments();
  }

  async runAudit(): Promise<void> {
    const contributingDeveloperService = ContributorAuditService.create(this.args.apiKey, this.args.apiURL, this.args.scmType)
    const auditParams = {
      "days": this.args.days,
      "secret": this.args.secret,
      "organizationName": this.args.organizationName,
      "scriptVersion": version,
    };
    soosLogger.info(`Running Contributing Developer audit for ${this.args.scmType}`)
    const contributingDevelopers = await contributingDeveloperService.audit(auditParams)
    soosLogger.info(`Contributing Developers found: ${JSON.stringify(contributingDevelopers, null, 2)}`)

    await contributingDeveloperService.uploadContributorAudits(this.args.clientId, contributingDevelopers);

    if (this.args.saveResults) {
      contributingDeveloperService.saveResults(contributingDevelopers)
    }

  }

  static async createAndRun(): Promise<void> {
    soosLogger.info("Starting SOOS SCA Analysis");
    soosLogger.logLineSeparator();
    try {
      const args = this.parseArgs();
      soosLogger.setMinLogLevel(args.logLevel);
      soosLogger.setVerbose(args.verbose);
      soosLogger.info("Configuration read");
      soosLogger.verboseDebug(
        JSON.stringify(
          obfuscateProperties(args as unknown as Record<string, unknown>, ["apiKey", "secret", "clientId"]),
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