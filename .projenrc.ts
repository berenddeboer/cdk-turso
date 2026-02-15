import { awscdk, javascript, javascript as js } from "projen"

const project = new awscdk.AwsCdkConstructLibrary({
  author: "Berend de Boer",
  authorAddress: "berend@pobox.com",
  cdkVersion: "2.1.0",
  defaultReleaseBranch: "main",
  jsiiVersion: "~5.9.0",
  name: "cdk-turso",
  packageManager: javascript.NodePackageManager.NPM,
  projenrcTs: true,
  repositoryUrl: "https://github.com/berend/cdk-turso.git",
  devDeps: ["@aws-sdk/client-ssm", "esbuild", "@biomejs/biome"],
  eslint: false,
  biome: true,
  biomeOptions: {
    biomeConfig: {
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
project.synth()
