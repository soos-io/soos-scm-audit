import GitHubContributorAuditProvider from "./ContributorAuditService/providers/GitHub/GitHubContributorAuditProvider";
import BitbucketCloudContributorAuditProvider from "./ContributorAuditService/providers/BitbucketCloud/BitbucketCloudContributorAuditProvider";
import { ArgumentParserBase, ICommonArguments } from "@soos-io/api-client";
import { ScmResultsFormat, ScmType } from "../enums";
import { Command, OptionValues, program } from "commander";
import { SOOS_SCM_AUDIT_CONSTANTS } from "../constants";

interface IContributorAuditArguments extends ICommonArguments {
  days: number;
  secret: string;
  saveResults: ScmResultsFormat;
  scmType: ScmType;
}

class ContributorAuditArgumentParser extends ArgumentParserBase {
  constructor(argumentParser: Command) {
    super(argumentParser);
  }

  static create(): ContributorAuditArgumentParser {
    const parser = program.description("SOOS SCM Audit");
    return new ContributorAuditArgumentParser(parser);
  }

  addBaseContributorArguments() {
    this.argumentParser.option(
      "--days",
      "Number of days to look back for commits.",
      (value: string) => {
        const parsedValue = parseInt(value, 10);
        if (isNaN(parsedValue) || parsedValue <= 0) {
          throw new Error(`Invalid value for days: ${value}`);
        }
        return parsedValue;
      },
      SOOS_SCM_AUDIT_CONSTANTS.Parameters.DefaultDaysAgo,
    );

    this.addEnumArgument(
      "--saveResults",
      ScmResultsFormat,
      "Save results to file, options available: JSON, TXT.",
      ScmResultsFormat.TXT,
    );

    this.addEnumArgument(
      "--scmType",
      ScmType,
      "Scm Type to use for the audit. Options: GitHub, Bitbucket.",
      ScmType.GitHub,
    );
  }

  parseArguments<T extends OptionValues>() {
    this.addCommonArguments();
    this.addBaseContributorArguments();

    this.argumentParser.parse();
    const preProviderArgs = this.argumentParser.opts<T>();

    switch (preProviderArgs.scmType) {
      case ScmType.GitHub:
        GitHubContributorAuditProvider.addProviderArgs(this.argumentParser);
        break;
      case ScmType.BitbucketCloud:
        BitbucketCloudContributorAuditProvider.addProviderArgs(this.argumentParser);
        break;
      default:
        throw new Error("Unsupported scmType");
    }

    this.argumentParser.parse();
    const args = this.argumentParser.opts<T>();
    return args;
  }
}

export default ContributorAuditArgumentParser;

export { IContributorAuditArguments };
