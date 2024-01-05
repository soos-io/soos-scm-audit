#!/usr/bin/env node
import { ArgumentParser } from "argparse";
import { LogLevel, soosLogger } from "@soos-io/api-client";
import { SCMSystem } from "./enums";
import { exit } from "process";
import {
  obfuscateProperties,
  sleep,
} from "@soos-io/api-client/dist/utilities";
import GitHubService from "./services/GitHubService";

interface SOOSSCMAuditArgs {
  clientId: string;
  apiKey: string;
  scmSystem: SCMSystem;
  githubPAT: string;
  logLevel: LogLevel;
  verbose: boolean;
}

class SOOSSCMAudit { 
  constructor(private args: SOOSSCMAuditArgs) {}

  static parseArgs(): SOOSSCMAuditArgs {
    const parser = new ArgumentParser({ description: `SOOS SCM Audit` });

    parser.add_argument("--apiKey", {
      help: `SOOS API Key`,
      required: false,
    });

    parser.add_argument("--clientId", {
      help: `SOOS Client ID`,
      required: false,
    });

    parser.add_argument("--scmSystem", {
      help: `SCM System`,
      required: false,
    });

    parser.add_argument("--githubPAT", {
      help: `GitHub Personal Access Token`,
      required: false,
    });

    parser.add_argument("--logLevel", {
      help: `Log Level`,
      required: false,
    });

    parser.add_argument("--verbose", {
      help: `Verbose`,
      required: false,
    });

    const args = parser.parse_args();

    return args;
  }

  async runAudit(): Promise<void> {
    const githubService = GitHubService.create(this.args.githubPAT);
    soosLogger.info(`Fetching GitHub orgs`);
    const orgs = await githubService.getGithubOrgs();
    soosLogger.info(`Fetched GitHub orgs: ${JSON.stringify(orgs, null, 2)}`);
  
    // Await the resolution of all promises returned by the map
    const repos = await Promise.all(orgs.map(async (org) => {
      soosLogger.info(`Fetching GitHub org repos for ${org.login}`);
      await sleep(1000); // Ensure sleep is awaited
      const repos = await githubService.getGithubOrgRepos(org);
      soosLogger.info(`Fetched GitHub org repos for ${org.login}: ${JSON.stringify(repos, null, 2)}`);
      return repos;
    }));
  
    soosLogger.info(`Fetched GitHub repos: ${JSON.stringify(repos, null, 2)}`);
  
    const contributors = await Promise.all(repos.flatMap(repoArray => 
      repoArray.map(async (repo) => {
        soosLogger.info(`Fetching GitHub repo contributors for ${repo.full_name}`);
        await sleep(1000); // Ensure sleep is awaited
        const contributors = await githubService.getContributorsForRepo(repo);
        soosLogger.info(`Fetched GitHub repo contributors for ${repo.full_name}: ${JSON.stringify(contributors, null, 2)}`);
        return contributors;
      })
    ));

    soosLogger.info(`Fetched GitHub contributors: ${JSON.stringify(contributors, null, 2)}`);
  
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
          obfuscateProperties(args as unknown as Record<string, unknown>, ["apiKey"]),
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