import { App } from 'aws-cdk-lib';
import { EksClusterStack } from './eks-blueprints/eks-cluster-stacks';
import { devEnv } from './shared/ap-southeast-1/environment';
import { TagsProp } from './shared/global/tagging';

const app = new App();

new EksClusterStack(app, 'EksBluePrintCluster', devEnv, {
  description: 'Dev EKS cluster',
  env: devEnv,
  tags: TagsProp('eks-blueprints', devEnv),
});

app.synth();
