/** @type {import('semantic-release').GlobalConfig} */
export default {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            { type: 'feat', section: 'Features' },
            { type: 'fix', section: 'Bug Fixes' },
            { type: 'perf', section: 'Performance Improvements', hidden: false },
            { type: 'docs', section: 'Documentation', hidden: false },
            { type: 'refactor', section: 'Code Refactoring', hidden: false },
            { type: 'revert', section: 'Reverts', hidden: false },
            { type: 'chore', hidden: true },
            { type: 'style', hidden: true },
            { type: 'test', hidden: true },
            { type: 'build', hidden: true },
            { type: 'ci', hidden: true },
          ],
        },
      },
    ],
    ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
    ['@semantic-release/npm', { npmPublish: false }],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json', 'package-lock.json'],
        message: `chore(release): \${nextRelease.version} [skip ci]\n\n\${nextRelease.notes}`,
      },
    ],
    '@semantic-release/github',
  ],
}
