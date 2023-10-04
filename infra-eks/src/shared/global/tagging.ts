import { Tags } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  PROJECT,
  CDK_PROJECT_NAME,
  ENVIRONMENT,
  SERVICE,
} from './constants';
import { EnvironmentConfig } from './environment';


export function CustomTags(
  stack: Construct,
  envConf: EnvironmentConfig,
  serviceName: string,
) {
  /**
   * AWS Tagging Strategy for Vincere resources
   *
   * Following AWS Tagging Strategy: https://hrboss.atlassian.net/wiki/spaces/devops/pages/2640084995/AWS+Tagging+Strategy
   */
  Tags.of(stack).add(PROJECT, CDK_PROJECT_NAME);
  Tags.of(stack).add(ENVIRONMENT, `${envConf.pattern}-${envConf.stage}`);
  Tags.of(stack).add(SERVICE, serviceName);
}

export function TagsProp(
  serviceName: string,
  envConf: EnvironmentConfig,
) {
  const tags: any = {
    [SERVICE]: serviceName,
    [PROJECT]: CDK_PROJECT_NAME,
    [ENVIRONMENT]: `${envConf.pattern}-${envConf.stage}`,
  };
  return tags;
}
