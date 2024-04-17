import * as deref from 'json-schema-deref-sync';

import * as assignees_schema from '../taps/tap-github/assignees.json';
import * as collaborators_schema from '../taps/tap-github/collaborators.json';
import * as comments_schema from '../taps/tap-github/comments.json';
import * as commit_comments_schema from '../taps/tap-github/commit_comments.json';
import * as commits_schema from '../taps/tap-github/commits.json';
import * as events_schema from '../taps/tap-github/events.json';
import * as issue_events_schema from '../taps/tap-github/issue_events.json';
import * as issue_labels_schema from '../taps/tap-github/issue_labels.json';
import * as issue_milestones_schema from '../taps/tap-github/issue_milestones.json';
import * as issues_schema from '../taps/tap-github/issues.json';
import * as pr_commits_schema from '../taps/tap-github/pr_commits.json';
import * as project_cards_schema from '../taps/tap-github/project_cards.json';
import * as project_columns_schema from '../taps/tap-github/project_columns.json';
import * as projects_schema from '../taps/tap-github/projects.json';
import * as pull_requests_schema from '../taps/tap-github/pull_requests.json';
import * as releases_schema from '../taps/tap-github/releases.json';
import * as review_comments_schema from '../taps/tap-github/review_comments.json';
import * as reviews_schema from '../taps/tap-github/reviews.json';
import * as stargazers_schema from '../taps/tap-github/stargazers.json';
import * as team_members_schema from '../taps/tap-github/team_members.json';
import * as team_memberships_schema from '../taps/tap-github/team_memberships.json';
import * as teams_schema from '../taps/tap-github/teams.json';

const deref_assignees = deref(assignees_schema, {
  baseFolder: '../taps/tap-github/tap_github/schemas',
});

export const tap_github_assignees = {
  type: 'object',
  required: [],
  ...deref_assignees,
};

const deref_collaborators = deref(collaborators_schema, {
  baseFolder: '../taps/tap-github/tap_github/schemas',
});

export const tap_github_collaborators = {
  type: 'object',
  required: [],
  ...deref_collaborators,
};

const deref_comments = deref(comments_schema, {
  baseFolder: '../taps/tap-github/tap_github/schemas',
});

export const tap_github_comments = {
  type: 'object',
  required: [],
  ...deref_comments,
};

const deref_commit_comments = deref(commit_comments_schema, {
  baseFolder: '../taps/tap-github/tap_github/schemas',
});

export const tap_github_commit_comments = {
  type: 'object',
  required: [],
  ...deref_commit_comments,
};

const deref_commits = deref(commits_schema, {
  baseFolder: '../taps/tap-github/tap_github/schemas',
});

export const tap_github_commits = {
  type: 'object',
  required: [],
  ...deref_commits,
};

const deref_events = deref(events_schema, {
  baseFolder: '../taps/tap-github/tap_github/schemas',
});

export const tap_github_events = {
  type: 'object',
  required: [],
  ...deref_events,
};

const deref_issue_events = deref(issue_events_schema, {
  baseFolder: '../taps/tap-github/tap_github/schemas',
});

export const tap_github_issue_events = {
  type: 'object',
  required: [],
  ...deref_issue_events,
};

const deref_issue_labels = deref(issue_labels_schema, {
  baseFolder: '../taps/tap-github/tap_github/schemas',
});

export const tap_github_issue_labels = {
  type: 'object',
  required: [],
  ...deref_issue_labels,
};

const deref_issue_milestones = deref(issue_milestones_schema, {
  baseFolder: '../taps/tap-github/tap_github/schemas',
});

export const tap_github_issue_milestones = {
  type: 'object',
  required: [],
  ...deref_issue_milestones,
};

const deref_issues = deref(issues_schema, {
  baseFolder: '../taps/tap-github/tap_github/schemas',
});

export const tap_github_issues = {
  endpoint: {
    required: ['type', 'owner', 'repo'],
    properties: {
      end_type: {
        type: 'string',
        description: 'The type of the endpoint',
        enum: ['issues', 'org_issues', 'repo_issues'],
      },
      oneOf: [
        {
          properties: {
            end_type: ['issues'],
          },
        },
        {
          properties: {
            end_type: ['org_issues'],
            owner: {
              type: 'string',
              description: 'The name of the organization',
            },
          },
        },
        {
          properties: {
            end_type: ['repo_issues'],
            owner: {
              type: 'string',
              description: 'The name of the organization',
            },
            repo: {
              type: 'string',
              description: 'The name of the repository',
            },
          },
        },
      ],
    },
  },
  type: 'object',
  required: [],
  ...deref_issues,
};

const deref_pr_commits = deref(pr_commits_schema, {
  baseFolder: '../taps/tap-github/tap_github/schemas',
});

export const tap_github_pr_commits = {
  type: 'object',
  required: [],
  ...deref_pr_commits,
};

const deref_project_cards = deref(project_cards_schema, {
  baseFolder: '../taps/tap-github/tap_github/schemas',
});

export const tap_github_project_cards = {
  type: 'object',
  required: [],
  ...deref_project_cards,
};

const deref_project_columns = deref(project_columns_schema, {
  baseFolder: '../taps/tap-github/tap_github/schemas',
});

export const tap_github_project_columns = {
  type: 'object',
  required: [],
  ...deref_project_columns,
};

const deref_projects = deref(projects_schema, {
  baseFolder: '../taps/tap-github/tap_github/schemas',
});

export const tap_github_projects = {
  type: 'object',
  required: [],
  ...deref_projects,
};

const deref_pull_requests = deref(pull_requests_schema, {
  baseFolder: '../taps/tap-github/tap_github/schemas',
});

export const tap_github_pull_requests = {
  type: 'object',
  required: [],
  ...deref_pull_requests,
};

const deref_releases = deref(releases_schema, {
  baseFolder: '../taps/tap-github/tap_github/schemas',
});

export const tap_github_releases = {
  type: 'object',
  required: [],
  ...deref_releases,
};

const deref_review_comments = deref(review_comments_schema, {
  baseFolder: '../taps/tap-github/tap_github/schemas',
});

export const tap_github_review_comments = {
  type: 'object',
  required: [],
  ...deref_review_comments,
};

const deref_reviews = deref(reviews_schema, {
  baseFolder: '../taps/tap-github/tap_github/schemas',
});

export const tap_github_reviews = {
  type: 'object',
  required: [],
  ...deref_reviews,
};

const deref_stargazers = deref(stargazers_schema, {
  baseFolder: '../taps/tap-github/tap_github/schemas',
});

export const tap_github_stargazers = {
  type: 'object',
  required: [],
  ...deref_stargazers,
};

const deref_team_members = deref(team_members_schema, {
  baseFolder: '../taps/tap-github/tap_github/schemas',
});

export const tap_github_team_members = {
  type: 'object',
  required: [],
  ...deref_team_members,
};

const deref_team_memberships = deref(team_memberships_schema, {
  baseFolder: '../taps/tap-github/tap_github/schemas',
});

export const tap_github_team_memberships = {
  type: 'object',
  required: [],
  ...deref_team_memberships,
};

const deref_teams = deref(teams_schema, {
  baseFolder: '../taps/tap-github/tap_github/schemas',
});

export const tap_github_teams = {
  type: 'object',
  required: [],
  ...deref_teams,
};
