import { CfnOutput, Stack } from 'aws-cdk-lib';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { SIMFLEXCLOUD_ZONE_ID, SIMFLEXCLOUD_ZONE_NAME } from '../shared/global/constants';
import { EnvironmentConfig } from '../shared/global/environment';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';

export class VclusterStacks extends Stack {
  constructor(scope: Stack, id: string, reg: EnvironmentConfig) {
    super(scope, id);

    const prefix = `${reg.pattern}-simflexcloud-${reg.stage}-vcluster`;

    const hostedZone = HostedZone.fromHostedZoneAttributes(this, `${prefix}-hosted-zone`, {
      hostedZoneId: SIMFLEXCLOUD_ZONE_ID,
      zoneName: SIMFLEXCLOUD_ZONE_NAME,
    });

    const acm = new Certificate(this, `${prefix}-acm`, {
      domainName: SIMFLEXCLOUD_ZONE_NAME,
      subjectAlternativeNames: ["*.simflexcloud.com", "simflexcloud.com"],
      validation: CertificateValidation.fromDns(hostedZone)
    });

    new CfnOutput(this, `${prefix}-acm-arn`, { value: acm.certificateArn, });
  }
}