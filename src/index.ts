#!/usr/bin/env node
import { version } from "../package.json";
import { ScanType, ScmType, soosLogger } from "@soos-io/api-client";
import { exit } from "process";
import {
  obfuscateProperties,
} from "@soos-io/api-client/dist/utilities";
import ContributingDeveloperAuditService from "@soos-io/api-client/dist/services/ContributingDeveloperAuditService/ContributingDeveloperAuditService";
import AnalysisArgumentParser, { ICommonArguments } from "@soos-io/api-client/dist/services/AnalysisArgumentParser";

interface SOOSSCMAuditArgs extends ICommonArguments {
  githubPAT: string;
  saveResults: boolean;
  scmType: ScmType;
}

class SOOSSCMAudit { 
  constructor(private args: SOOSSCMAuditArgs) {}

  static parseArgs(): SOOSSCMAuditArgs {
    const analysisArgumentParser = AnalysisArgumentParser.create(ScanType.SCM);
    analysisArgumentParser.addSCMAuditArguments(
      version,
    );

    soosLogger.info("Parsing arguments");
    return analysisArgumentParser.parseArguments();
  }

  async runAudit(): Promise<void> {
    const contributingDeveloperService = new ContributingDeveloperAuditService(ScmType.GitHub)
    const auditParams = {
      "githubPAT": this.args.githubPAT,
    };
    soosLogger.info(`Running Contributing Developer audit for ${this.args.scmType}`)
    const contributingDevelopers = await contributingDeveloperService.audit(auditParams)
    soosLogger.info(`Contributing Developers found: ${JSON.stringify(contributingDevelopers, null, 2)}`)

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
          obfuscateProperties(args as unknown as Record<string, unknown>, ["apiKey", "githubPAT"]),
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