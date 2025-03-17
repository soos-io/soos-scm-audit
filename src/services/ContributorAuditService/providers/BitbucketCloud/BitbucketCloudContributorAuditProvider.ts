import { IContributorAuditProvider } from "../../ContributorAuditService";
import { DataMappingUtilities, ParamUtilities } from "../../utilities";
import BitbucketCloudApiClient, { BitbucketCloudRepository } from "./BitbucketCloudApiClient";
import { SOOS_BITBUCKET_CLOUD_CONTRIBUTOR_AUDIT_CONSTANTS } from "./constants";
import ContributorAuditArgumentParser, {
  IContributorAuditArguments,
} from "../../../ContributorAuditArgumentParser";
import {
  IContributorAuditModel,
  IContributorAuditRepositories,
} from "@soos-io/api-client/dist/api/SOOSHooksApiClient";
import { soosLogger } from "@soos-io/api-client";

interface IBitBucketContributorAuditArguments extends IContributorAuditArguments {
  username: string;
  workspace: string;
}

class BitbucketCloudContributorAuditProvider implements IContributorAuditProvider {
  public async audit(
    implementationParams: Record<string, string | number>,
  ): Promise<IContributorAuditModel> {
    const bitbucketPAT = ParamUtilities.getAsString(implementationParams, "secret");
    const workspace = ParamUtilities.getAsString(implementationParams, "workspace");
    const days = ParamUtilities.getAsNumber(implementationParams, "days");
    const username = ParamUtilities.getAsString(implementationParams, "username");
    const bitbucketApiClient = new BitbucketCloudApiClient(days, username, bitbucketPAT, workspace);
    const repositories = await bitbucketApiClient.getBitbucketCloudRepositories();
    soosLogger.debug("Fetching commits for each repository");
    const contributors = await this.getBitbucketCloudRepositoryContributors(
      bitbucketApiClient,
      repositories,
      SOOS_BITBUCKET_CLOUD_CONTRIBUTOR_AUDIT_CONSTANTS.RequestBatchSize,
    );
    const scriptVersion = ParamUtilities.getAsString(implementationParams, "scriptVersion");

    const finalContributors: IContributorAuditModel = {
      metadata: {
        scriptVersion: scriptVersion,
        days: days,
      },
      organizationName: workspace,
      contributors: contributors,
    };

    return finalContributors;
  }

  public static addProviderArgs(argumentParser: ContributorAuditArgumentParser): void {
    argumentParser.addArgument("--workspace", "Organization name to use for the audit.", {
      required: true,
    });
    argumentParser.addArgument(
      "--secret",
      "Secret to use for api calls, it should be an app password.",
      { required: true },
    );
    argumentParser.addArgument("--username", "Username for audit.", { required: true });
  }

  private async getBitbucketCloudRepositoryContributors(
    bitbucketApiClient: BitbucketCloudApiClient,
    repositories: BitbucketCloudRepository[],
    batchSize: number,
  ): Promise<IContributorAuditRepositories[]> {
    const contributorsArray: IContributorAuditRepositories[][] = [];

    for (let i = 0; i < repositories.length; i += batchSize) {
      const batch = repositories.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map((repo) => bitbucketApiClient.getBitbucketCloudRepositoryContributors(repo)),
      );
      contributorsArray.push(...results);
    }

    return DataMappingUtilities.mergeContributors(contributorsArray);
  }
}

export default BitbucketCloudContributorAuditProvider;

export { IBitBucketContributorAuditArguments };
