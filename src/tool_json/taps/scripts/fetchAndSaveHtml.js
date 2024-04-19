const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const puppeteer = require('puppeteer');

const urls = [
  'quickstart',
  'about-the-rest-api/about-the-rest-api',
  'about-the-rest-api/comparing-githubs-rest-api-and-graphql-api',
  'about-the-rest-api/api-versions',
  'about-the-rest-api/breaking-changes',
  'about-the-rest-api/about-the-openapi-description-for-the-rest-api',
  'using-the-rest-api/getting-started-with-the-rest-api',
  'using-the-rest-api/rate-limits-for-the-rest-api',
  'using-the-rest-api/using-pagination-in-the-rest-api',
  'using-the-rest-api/libraries-for-the-rest-api',
  'using-the-rest-api/best-practices-for-using-the-rest-api',
  'using-the-rest-api/troubleshooting-the-rest-api',
  'using-the-rest-api/timezones-and-the-rest-api',
  'using-the-rest-api/using-cors-and-jsonp-to-make-cross-origin-requests',
  'using-the-rest-api/issue-event-types',
  'using-the-rest-api/github-event-types',
  'authentication/authenticating-to-the-rest-api',
  'authentication/keeping-your-api-credentials-secure',
  'authentication/endpoints-available-for-github-app-installation-access-tokens',
  'authentication/endpoints-available-for-github-app-user-access-tokens',
  'authentication/endpoints-available-for-fine-grained-personal-access-tokens',
  'authentication/permissions-required-for-github-apps',
  'authentication/permissions-required-for-fine-grained-personal-access-tokens',
  'guides/scripting-with-the-rest-api-and-javascript',
  'guides/scripting-with-the-rest-api-and-ruby',
  'guides/discovering-resources-for-a-user',
  'guides/delivering-deployments',
  'guides/rendering-data-as-graphs',
  'guides/working-with-comments',
  'guides/building-a-ci-server',
  'guides/using-the-rest-api-to-interact-with-your-git-database',
  'guides/using-the-rest-api-to-interact-with-checks',
  'guides/encrypting-secrets-for-the-rest-api',
  'actions/artifacts',
  'actions/cache',
  'actions/oidc',
  'actions/permissions',
  'actions/secrets',
  'actions/self-hosted-runners',
  'actions/variables',
  'actions/workflow-jobs',
  'actions/workflow-runs',
  'actions/workflows',
  'activity/events',
  'activity/feeds',
  'activity/notifications',
  'activity/starring',
  'activity/watching',
  'apps/github-apps',
  'apps/installations',
  'apps/marketplace',
  'apps/oauth-authorizations',
  'apps/webhooks',
  'billing/billing',
  'branches/branches',
  'branches/protected-branches',
  'checks/check-runs',
  'checks/check-suites',
  'classroom/classroom',
  'code-scanning/code-scanning',
  'codes-of-conduct/codes-of-conduct',
  'codespaces/codespaces',
  'codespaces/organizations',
  'codespaces/organization-secrets',
  'codespaces/machines',
  'codespaces/repository-secrets',
  'codespaces/user-secrets',
  'collaborators/collaborators',
  'collaborators/invitations',
  'commits/commits',
  'commits/commit-comments',
  'commits/commit-statuses',
  'copilot/user-management',
  'dependabot/alerts',
  'dependabot/secrets',
  'dependency-graph/dependency-review',
  'dependency-graph/dependency-submission',
  'dependency-graph/software-bill-of-materials',
  'deploy-keys/deploy-keys',
  'deployments/deployment-branch-policies',
  'deployments/deployments',
  'deployments/environments',
  'deployments/protection-rules',
  'deployments/deployment-statuses',
  'emojis/emojis',
  'gists/gists',
  'gists/comments',
  'git/blobs',
  'git/commits',
  'git/references',
  'git/tags',
  'git/trees',
  'gitignore/gitignore',
  'interactions/org',
  'interactions/repo',
  'interactions/user',
  'issues/issues',
  'issues/assignees',
  'issues/comments',
  'issues/events',
  'issues/labels',
  'issues/milestones',
  'issues/timeline',
  'licenses/licenses',
  'markdown/markdown',
  'meta/meta',
  'metrics/community',
  'metrics/statistics',
  'metrics/traffic',
  'migrations/orgs',
  'migrations/source-imports',
  'migrations/users',
  'organizations/blocking',
  'organizations/custom-properties',
  'organizations/members',
  'organizations/organization-roles',
  'organizations/organizations',
  'organizations/outside-collaborators',
  'organizations/personal-access-tokens',
  'organizations/rule-suites',
  'organizations/rules',
  'organizations/security-managers',
  'organizations/webhooks',
  'packages/packages',
  'pages/pages',
  'projects(classic)/boards',
  'projects(classic)/cards',
  'projects(classic)/collaborators',
  'projects(classic)/columns',
  'pull-requests/pull-requests',
  'pull-requests/review-comments',
  'pull-requests/review-requests',
  'pull-requests/reviews',
  'rate-limit/rate-limit',
  'reactions/reactions',
  'releases/releases',
  'releases/assets',
  'repositories/autolinks',
  'repositories/contents',
  'repositories/custom-properties',
  'repositories/forks',
  'repositories/repositories',
  'repositories/rule-suites',
  'repositories/rules',
  'repositories/tags',
  'repositories/webhooks',
  'search/search',
  'secret-scanning/secret-scanning',
  'security-advisories/global',
  'security-advisories/repository',
  'teams/teams',
  'teams/discussion-comments',
  'teams/discussions',
  'teams/members',
  'users/users',
  'users/blocking',
  'users/emails',
  'users/followers',
  'users/gpg-keys',
  'users/git-ssh-keys',
  'users/ssh-signing-keys',
  'users/social-accounts',
];

async function fetchAndSaveHtml(url, index) {
  const base = 'https://docs.github.com/en/rest/';
  const fullUrl = `${base}${url}`;

  // const browser = await puppeteer.launch();
  // const page = await browser.newPage();
  // await page.goto(fullUrl, {
  //   waitUntil: 'networkidle0',
  // });

  // page
  //   .content()

  axios
    .get(fullUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
      },
      maxRedirects: 5, // Limit the number of redirects
    })
    .then((response) => {
      // .then((response) => {
      // const response = response.data;
      console.log('response', url);
      const $ = cheerio.load(response.data);
      const specificBlock = $('#main-content').text();
      console.log('specificBlock', specificBlock);
      if (specificBlock) {
        const modifiedUrl = url.replace(/\//g, '-');

        fs.writeFile(
          // `../tap-hubspot/docs/${modifiedUrl}.html`,
          // replace forward slashes with dashes
          `../../../../../ai-taps/ai-taps-github/docs/${modifiedUrl}.html`,
          specificBlock,
          (err) => {
            if (err) {
              console.log(modifiedUrl);
              console.error('Error writing to file:', err);
            } else {
              console.log(
                `Successfully saved the HTML block from ${url} to ${modifiedUrl}.html`,
              );
            }
          },
        );
      } else {
        console.log(url);
        console.log(`The specified HTML block was not found in ${url}.`);
      }
    })
    .catch((error) => {
      console.error('Error fetching the page:', error);
    })
    .finally(() => {
      // Wait for 1 second before making the next request
      if (index < urls.length - 1) {
        setTimeout(() => fetchAndSaveHtml(urls[index + 1], index + 1), 300);
      }
    });
}

// Start the loop with the first URL
if (urls.length > 0) {
  fetchAndSaveHtml(urls[0], 0);
} else {
  console.log('No URLs provided.');
}
