import { Environment } from 'aws-cdk-lib';

export interface EnvironmentConfig extends Environment {
  pattern: string;
  envTag: string;
  stage: string;
}