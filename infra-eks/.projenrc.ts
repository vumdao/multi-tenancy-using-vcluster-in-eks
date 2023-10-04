import { awscdk, javascript } from 'projen';
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.97.0',
  defaultReleaseBranch: 'main',
  github: false,
  name: 'eks-blueprints-nginx-vcluster',
  packageManager: javascript.NodePackageManager.PNPM,
  projenrcTs: true,
  typescriptVersion: '4.3.5',
  deps: [
    '@aws-quickstart/eks-blueprints@1.11.3',
  ],
});
project.synth();