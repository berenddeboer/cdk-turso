import * as fs from "fs"
import * as path from "path"
import { awscdk, github, javascript, javascript as js } from "projen"

const project = new awscdk.AwsCdkConstructLibrary({
  author: "Berend de Boer",
  authorAddress: "berend@pobox.com",
  cdkVersion: "2.1.0",
  defaultReleaseBranch: "main",
  jsiiVersion: "~5.9.0",
  name: "cdk-turso",
  packageManager: javascript.NodePackageManager.NPM,
  projenrcTs: true,
  repositoryUrl: "https://github.com/berenddeboer/cdk-turso.git",
  devDeps: ["@aws-sdk/client-ssm", "esbuild", "@biomejs/biome", "husky"],
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

const huskyDir = path.join(project.outdir, ".husky")
if (!fs.existsSync(huskyDir)) {
  fs.mkdirSync(huskyDir, { recursive: true })
}
fs.writeFileSync(
  path.join(huskyDir, "pre-commit"),
  "npx projen biome && npx projen build\n",
)

project.synth()
