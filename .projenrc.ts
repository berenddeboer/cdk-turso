import * as fs from "fs"
import * as path from "path"
import { awscdk, github, javascript, javascript as js } from "projen"

const project = new awscdk.AwsCdkConstructLibrary({
  author: "Berend de Boer",
  authorAddress: "berend@pobox.com",
  cdkVersion: "2.224.0",
  constructsVersion: "10.3.0",
  defaultReleaseBranch: "main",
  description:
    "AWS CDK constructs to create Turso Cloud databases and manage auth tokens.",
  jsiiVersion: "~5.9.0",
  keywords: ["aws-cdk", "cdk", "constructs", "turso", "libsql"],
  minMajorVersion: 1,
  name: "cdk-turso",
  packageManager: javascript.NodePackageManager.NPM,
  projenrcTs: true,
  repositoryUrl: "https://github.com/berenddeboer/cdk-turso.git",
  githubOptions: {
    pullRequestLintOptions: {
      semanticTitleOptions: {
        types: ["feat", "fix", "chore", "refactor", "docs", "test", "vendor"],
      },
    },
  },
  devDeps: [
    "@aws-sdk/client-ssm",
    "esbuild",
    "@biomejs/biome",
    "@types/node@^24",
    "husky",
    "exponential-backoff",
  ],
  eslint: false,
  biome: true,
  workflowNodeVersion: "24.x",
  releaseToNpm: true,
  npmAccess: javascript.NpmAccess.PUBLIC,
  npmProvenance: true,
  npmTrustedPublishing: true,
  depsUpgradeOptions: {
    workflowOptions: {
      projenCredentials: github.GithubCredentials.fromPersonalAccessToken({
        secret: "GITHUB_TOKEN",
      }),
    },
  },
  biomeOptions: {
    biomeConfig: {
      files: {
        includes: ["!biome.jsonc"],
      },
      formatter: {
        indentStyle: js.biome_config.IndentStyle.SPACE,
        indentWidth: 2,
        lineWidth: 80,
      },
      javascript: {
        formatter: {
          quoteStyle: js.biome_config.QuoteStyle.DOUBLE,
          semicolons: js.biome_config.Semicolons.AS_NEEDED,
          trailingCommas: js.biome_config.JsTrailingCommas.ALL,
          quoteProperties: js.biome_config.QuoteProperties.AS_NEEDED,
          bracketSpacing: true,
          arrowParentheses: js.biome_config.ArrowParentheses.ALWAYS,
        },
      },
      linter: {
        rules: {
          recommended: false,
          complexity: { useLiteralKeys: "off" },
          correctness: { noUnusedImports: "error", noUnusedVariables: "error" },
          suspicious: {
            noConfusingVoidType: "error",
            noShadowRestrictedNames: "off",
          },
          style: { useNodejsImportProtocol: "off" },
        },
      },
      overrides: [
        {
          includes: ["biome.jsonc"],
          formatter: { enabled: false },
          linter: { enabled: false },
        },
        {
          includes: ["**/*.test.ts"],
          linter: {
            rules: {
              style: { noNonNullAssertion: "off" },
            },
          },
        },
      ],
    },
  },
})
project.projectBuild.compileTask.exec(
  "esbuild src/handler/index.ts --bundle --platform=node --target=node24 --outfile=lib/handler/index.js --external:@aws-sdk/*",
)

const dependabot = project.github?.addDependabot()
if (dependabot) {
  dependabot.config.updates = [
    {
      "package-ecosystem": "github-actions",
      directory: "/",
      schedule: {
        interval: github.DependabotScheduleInterval.WEEKLY,
      },
      allow: [{ "dependency-name": "anthropics/claude-code-action" }],
    },
  ]
}

const huskyDir = path.join(project.outdir, ".husky")
if (!fs.existsSync(huskyDir)) {
  fs.mkdirSync(huskyDir, { recursive: true })
}
fs.writeFileSync(
  path.join(huskyDir, "pre-commit"),
  "npx projen biome && npx projen build\n",
)

project.synth()
