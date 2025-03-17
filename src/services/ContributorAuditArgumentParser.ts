import GitHubContributorAuditProvider from "./ContributorAuditService/providers/GitHub/GitHubContributorAuditProvider";
import BitbucketCloudContributorAuditProvider from "./ContributorAuditService/providers/BitbucketCloud/BitbucketCloudContributorAuditProvider";
import { ArgumentParserBase, ICommonArguments } from "@soos-io/api-client";
import { ScmResultsFormat, ScmType } from "../enums";
import { InvalidArgumentError, OptionValues } from "commander";
import { SOOS_SCM_AUDIT_CONSTANTS } from "../constants";

interface IContributorAuditArguments extends ICommonArguments {
  days: number;
  secret: string;
  saveResults: ScmResultsFormat;
  scmType: ScmType;
}

class ContributorAuditArgumentParser extends ArgumentParserBase {
  constructor(description: string) {
    super(description);
    this.addBaseContributorArguments();
  }

  static create(): ContributorAuditArgumentParser {
    return new ContributorAuditArgumentParser("SOOS SCM Audit");
  }

  addBaseContributorArguments() {
    this.addArgument("--days", "Number of days to look back for commits.", {
      defaultValue: SOOS_SCM_AUDIT_CONSTANTS.Parameters.DefaultDaysAgo,
      argParser: (value: string) => {
        const parsedValue = parseInt(value, 10);
        if (isNaN(parsedValue) || parsedValue <= 0) {
          throw new InvalidArgumentError(`Invalid value for days: ${value}`);
        }
        return parsedValue;
      },
    });

    this.addEnumArgument(
      "--saveResults",
      ScmResultsFormat,
      "Save results to file, options available: JSON, TXT.",
      {
        defaultValue: ScmResultsFormat.TXT,
      },
    );

    this.addEnumArgument(
      "--scmType",
      ScmType,
      "Scm Type to use for the audit. Options: GitHub, Bitbucket.",
      {
        defaultValue: ScmType.GitHub,
      },
    );
  }

  override parseArguments<T extends OptionValues>(argv?: string[]) {
    const args = super.parseArguments(argv);
    switch (args.scmType) {
      case ScmType.GitHub:
        GitHubContributorAuditProvider.addProviderArgs(this);
        break;
      case ScmType.BitbucketCloud:
        BitbucketCloudContributorAuditProvider.addProviderArgs(this);
        break;
      default:
        throw new Error("Unsupported scmType: " + args.scmType);
    }

    return super.parseArguments<T>(argv);
  }
}

export default ContributorAuditArgumentParser;

export { IContributorAuditArguments };
