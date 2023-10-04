import {
  CDK_DEFAULT_ACCOUNT,
  DEV_ENV_STAGE,
  DEV_ENV_TAG,
} from '../global/constants';
import { EnvironmentConfig } from '../global/environment';

export const devEnv: EnvironmentConfig = {
  pattern: 'sin',
  envTag: DEV_ENV_TAG,
  stage: DEV_ENV_STAGE,
  account: CDK_DEFAULT_ACCOUNT,
  region: 'ap-southeast-1', // Singapore
};
