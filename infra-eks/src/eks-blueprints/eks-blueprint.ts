import {
  AwsLoadBalancerControllerAddOn,
  ClusterAddOn,
  EbsCsiDriverAddOn,
  GenericClusterProvider,
  KarpenterAddOn,
  MetricsServerAddOn,
  VpcCniAddOn,
} from '@aws-quickstart/eks-blueprints';
import {
  KubernetesVersion,
} from 'aws-cdk-lib/aws-eks';
import { EnvironmentConfig } from '../shared/global/environment';
import { TagsProp } from '../shared/global/tagging';

export function EksAddOns(env: EnvironmentConfig): Array<ClusterAddOn> {
  const AddOns: Array<ClusterAddOn> = [
    new VpcCniAddOn(),
    new MetricsServerAddOn(),
    new AwsLoadBalancerControllerAddOn(),
    new EbsCsiDriverAddOn(),
    new KarpenterAddOn({
      consolidation: { enabled: true },
      subnetTags: {
        Name: `EksBluePrintCluster/${env.pattern}-simflexcloud-${env.stage}-${env.envTag}-vpc/PrivateSubnet*`,
      },
      securityGroupTags: {
        [`kubernetes.io/cluster/${env.pattern}-simflexcloud-${env.stage}-${env.envTag}-eks-blueprint`]: 'owned',
      },
      amiFamily: 'Bottlerocket',
      limits: {
        resources: {
          memory: '10Gi'
        }
      },
      requirements: [
        {
          key: 'karpenter.sh/capacity-type',
          op: 'In',
          vals: ['spot'],
        },
        {
          key: 'node.kubernetes.io/instance-type',
          op: 'In',
          vals: ['t3a.small', 't3.small', 't3a.medium', 't3.medium'],
        },
      ],
    }),
  ];
  return AddOns;
}

export const EKS_KUBERNETES_VERSION = KubernetesVersion.V1_27;

export function EksComponents(env: EnvironmentConfig) {
  const fargateProvider = new GenericClusterProvider({
    version: EKS_KUBERNETES_VERSION,
    fargateProfiles: {
      karpenter: {
        fargateProfileName: 'karpenter',
        selectors: [{ namespace: 'karpenter' }],
      },
    },
    tags: TagsProp('eks-blueprints-node-group', env),
  });
  return fargateProvider;
}
