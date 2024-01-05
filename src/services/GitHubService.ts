import { soosLogger } from "@soos-io/api-client";

export interface GitHubOrganization {
  login: string;
  id: number;
  node_id: string;
  url: string;
  repos_url: string;
  events_url: string;
  hooks_url: string;
  issues_url: string;
  members_url: string;
  public_members_url: string;
  avatar_url: string;
  description: string | null;
}

export interface GitHubRepository { 
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: GitHubOrganization;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
}

const d = new Date();
d.setDate(d.getDate() - 90);
export const threeMonthsDate = `${d.getUTCFullYear()}-${
  d.getMonth() + 1
}-${d.getUTCDate()}T${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}Z`;


class GitHubService {
  public githubPAT: string;
  public apiURL: string;

  constructor(githubPAT: string, apiURL: string = "https://api.github.com") {
    this.githubPAT = githubPAT;
    this.apiURL = apiURL;
  }

  static create(githubPAT: string) {
    return new GitHubService(githubPAT);
  }

  async getGithubOrgs(): Promise<GitHubOrganization[]> {
    const url = `${this.apiURL}/user/orgs?per_page=100`;
    soosLogger.verboseDebug(`Fetching GitHub orgs from ${url}`);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/vnd.github+json",
        Authorization: `Bearer ${this.githubPAT}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub orgs: ${response.statusText}`);
    }
    soosLogger.verboseDebug(`Fetched GitHub orgs from ${url}`);
    const orgs: GitHubOrganization[] = await response.json();
    soosLogger.verboseDebug(`GitHub orgs response: ${JSON.stringify(orgs)}`);
    return orgs;
  }

  async getGithubOrgRepos(org: GitHubOrganization): Promise<GitHubRepository[]> {
    const url = `${this.apiURL}/orgs/${org.login}/repos?per_page=1`;
    soosLogger.verboseDebug(`Fetching GitHub org repos from ${url}`);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/vnd.github+json",
        Authorization: `Bearer ${this.githubPAT}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub org repos: ${response.statusText}`);
    }
    soosLogger.verboseDebug(`Fetched GitHub org repos from ${url}`);
    const repos: GitHubRepository[] = await response.json();
    soosLogger.verboseDebug(`GitHub org repos response: ${JSON.stringify(repos)}`);
    return repos;
  }

  async getContributorsForRepo(repo: GitHubRepository): Promise<GitHubRepository[]> {
    const url = `${this.apiURL}/repos/${repo.owner.login}/${repo.name}/commits?per_page=100&since=${threeMonthsDate}`;
    soosLogger.verboseDebug(`Fetching GitHub repo contributors from ${url}`);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/vnd.github+json",
        Authorization: `Bearer ${this.githubPAT}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub repo contributors: ${response.statusText}`);
    }
    soosLogger.verboseDebug(`Fetched GitHub repo contributors from ${url}`);
    const commits: any[] = await response.json();
    const contributors: any[] = [];
    commits.forEach((commit: any) => {
      if (!contributors.includes(commit.author.login)) {
        contributors.push(commit.author.login);
      }
    });
    soosLogger.verboseDebug(`GitHub repo contributors response: ${JSON.stringify(contributors)}`);
    return contributors;
  }

}

export default GitHubService;