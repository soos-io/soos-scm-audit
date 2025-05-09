import GitHubContributorAuditProvider from "./ContributorAuditService/providers/GitHub/GitHubContributorAuditProvider";
import BitbucketCloudContributorAuditProvider from "./ContributorAuditService/providers/BitbucketCloud/BitbucketCloudContributorAuditProvider";
import {
  ArgumentParserBase,
  ICommonArguments,
  IntegrationName,
  IntegrationType,
  ParsedOptions,
  ScanType,
} from "@soos-io/api-client";
import { ScmResultsFormat, ScmType } from "../enums";
import { SOOS_SCM_AUDIT_CONSTANTS } from "../constants";
import { version } from "../../package.json";

interface IContributorAuditArguments extends ICommonArguments {
  days: number;
  secret: string;
  resultsFormat: ScmResultsFormat;
  scmType: ScmType;
}

class ContributorAuditArgumentParser extends ArgumentParserBase {
  constructor(description: string) {
    super(description, ScanType.SCA, version, IntegrationName.SoosScmAudit, IntegrationType.Script);
    this.addBaseContributorArguments();
  }

  static create(): ContributorAuditArgumentParser {
    return new ContributorAuditArgumentParser("SOOS SCM Audit");
  }

  addBaseContributorArguments() {
    this.addArgument("days", "Number of days to look back for commits.", {
      defaultValue: SOOS_SCM_AUDIT_CONSTANTS.Parameters.DefaultDaysAgo,
      argParser: (value: string) => {
        const parsedValue = parseInt(value, 10);
        if (isNaN(parsedValue) || parsedValue <= 0) {
          throw new Error(`Invalid value for days, use a positive integer: ${value}`);
        }
        return parsedValue;
      },
    });

    this.addEnumArgument(
      "resultsFormat",
      ScmResultsFormat,
      "Format of results file: JSON or TXT. Default is TXT.",
      {
        defaultValue: ScmResultsFormat.TXT,
      },
    );

    this.addEnumArgument("scmType", ScmType, "Scm Type to use for the audit. Default is GitHub.", {
      required: true,
      defaultValue: ScmType.GitHub,
    });
  }

  override parseArguments<T extends ParsedOptions>(argv?: string[]) {
    const preArgs = this.preParseArguments(argv);
    switch (preArgs.scmType) {
      case ScmType.GitHub:
        GitHubContributorAuditProvider.addProviderArgs(this);
        break;
      case ScmType.BitbucketCloud:
        BitbucketCloudContributorAuditProvider.addProviderArgs(this);
        break;
      default:
        throw new Error("Unsupported scmType: " + preArgs.scmType);
    }

    return super.parseArguments<T>(argv);
  }
}

export default ContributorAuditArgumentParser;

export { IContributorAuditArguments };
