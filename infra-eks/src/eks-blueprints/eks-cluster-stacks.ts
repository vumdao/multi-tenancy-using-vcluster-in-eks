import { DirectVpcProvider, EksBlueprint, GlobalResources } from '@aws-quickstart/eks-blueprints';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster } from 'aws-cdk-lib/aws-eks';
import { Construct } from 'constructs';
import { EksAddOns, EksComponents, EKS_KUBERNETES_VERSION } from './eks-blueprint';
import { VclusterStacks } from './vcluster';
import { EnvironmentConfig } from '../shared/global/environment';
import { TagsProp } from '../shared/global/tagging';

export class EksClusterStack extends Stack {
  eksCluster: Cluster;

  constructor(
    scope: Construct,
    id: string,
    reg: EnvironmentConfig,
    props: StackProps,
  ) {
    super(scope, id, props);

    const prefix = `${reg.pattern}-simflexcloud-${reg.stage}-${reg.envTag}`;

    const AddOns = EksAddOns(reg);

    const vpc = new Vpc(this, `${prefix}-vpc`, {
      vpcName: prefix,
      maxAzs: 2,
    });

    const cluster = EksBlueprint.builder()
      .name(`${prefix}-eks-blueprint`)
      .account(reg.account)
      .region(reg.region)
      .addOns(...AddOns)
      .version(EKS_KUBERNETES_VERSION)
      .clusterProvider(EksComponents(reg))
      .resourceProvider(GlobalResources.Vpc, new DirectVpcProvider(vpc))
      .build(scope, `${prefix}-eks-blueprint`, {
        description: 'EKS Blueprints',
        env: {
          region: reg.region,
          account: reg.account,
        },
        tags: TagsProp('eks-blueprints', reg),
      });

    this.eksCluster = (cluster.getClusterInfo().cluster as any) as Cluster;

    new VclusterStacks(this, `${prefix}-vcluster`, reg);
  }
}
