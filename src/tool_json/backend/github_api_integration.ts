import {
  tap_github_assignees,
  tap_github_collaborators,
  tap_github_comments,
  tap_github_commit_comments,
  tap_github_commits,
  tap_github_events,
  tap_github_issue_events,
  tap_github_issue_labels,
  tap_github_issue_milestones,
  tap_github_issues,
  tap_github_pr_commits,
  tap_github_project_cards,
  tap_github_project_columns,
  tap_github_projects,
  tap_github_pull_requests,
  tap_github_releases,
  tap_github_review_comments,
  tap_github_reviews,
  tap_github_stargazers,
  tap_github_team_members,
  tap_github_team_memberships,
  tap_github_teams,
} from '../compiled_taps/github';

const github_api_integration = {
  type: 'function',
  function: {
    name: 'github_api_integration',
    description: 'This function will integrate with the GitHub API.',
    parameters: {
      type: 'object',
      properties: {
        operation: {
          type: 'string',
          description: 'The operation to perform',
          enum: ['get', 'post', 'put', 'delete'],
        },
        entity: {
          type: 'string',
          description: 'The entity to perform the operation on.',
          enum: [
            'assignees',
            'collaborators',
            'comments',
            'commit_comments',
            'commits',
            'events',
            'issue_events',
            'issue_labels',
            'issue_milestones',
            'issues',
            'pr_commits',
            'project_cards',
            'project_columns',
            'projects',
            'pull_requests',
            'releases',
            'review_comments',
            'reviews',
            'stargazers',
            'team_members',
            'team_memberships',
            'teams',
          ],
        },
        body: {
          type: 'object',
          description: 'The data to update the entity with',
          oneOf: [
            {
              entity: 'assignees',
              description: 'The data to update the assignees with',

              ...tap_github_assignees,
            },
            {
              entity: 'collaborators',
              description: 'The data to update the collaborators with',
              ...tap_github_collaborators,
            },
            {
              entity: 'comments',
              description: 'The data to update the comments with',
              ...tap_github_comments,
            },
            {
              entity: 'commit_comments',
              description: 'The data to update the commit_comments with',
              ...tap_github_commit_comments,
            },
            {
              entity: 'commits',
              description: 'The data to update the commits with',
              ...tap_github_commits,
            },
            {
              entity: 'events',
              description: 'The data to update the events with',
              ...tap_github_events,
            },
            {
              entity: 'issue_events',
              description: 'The data to update the issue_events with',
              ...tap_github_issue_events,
            },
            {
              entity: 'issue_labels',
              description: 'The data to update the issue_labels with',
              ...tap_github_issue_labels,
            },
            {
              entity: 'issue_milestones',
              description: 'The data to update the issue_milestones with',
              ...tap_github_issue_milestones,
            },
            {
              entity: 'issues',
              description: 'The data to update the issues with',
              ...tap_github_issues,
            },
            {
              entity: 'pr_commits',
              description: 'The data to update the pr_commits with',
              ...tap_github_pr_commits,
            },
            {
              entity: 'project_cards',
              description: 'The data to update the project_cards with',
              ...tap_github_project_cards,
            },
            {
              entity: 'project_columns',
              description: 'The data to update the project_columns with',
              ...tap_github_project_columns,
            },
            {
              entity: 'projects',
              description: 'The data to update the projects with',
              ...tap_github_projects,
            },
            {
              entity: 'pull_requests',
              description: 'The data to update the pull_requests with',
              ...tap_github_pull_requests,
            },
            {
              entity: 'releases',
              description: 'The data to update the releases with',
              ...tap_github_releases,
            },
            {
              entity: 'review_comments',
              description: 'The data to update the review_comments with',
              ...tap_github_review_comments,
            },
            {
              entity: 'reviews',
              description: 'The data to update the reviews with',
              ...tap_github_reviews,
            },
            {
              entity: 'stargazers',
              description: 'The data to update the stargazers with',
              ...tap_github_stargazers,
            },
            {
              entity: 'team_members',
              description: 'The data to update the team_members with',
              ...tap_github_team_members,
            },
            {
              entity: 'team_memberships',
              description: 'The data to update the team_memberships with',
              ...tap_github_team_memberships,
            },
            {
              entity: 'teams',
              description: 'The data to update the teams with',
              ...tap_github_teams,
            },
          ],
        },
      },
    },
  },
};

export default github_api_integration;
