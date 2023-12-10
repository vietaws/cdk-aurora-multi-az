import { Stack, StackProps } from 'aws-cdk-lib';
import {
  IVpc,
  Vpc,
  IpAddresses,
  SubnetType,
  ISecurityGroup,
  SecurityGroup,
} from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class VpcStack extends Stack {
  public vpc: IVpc;
  public dbSg: ISecurityGroup;
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);
    this.vpc = new Vpc(this, 'vpc-cdk', {
      availabilityZones: [
        'ap-southeast-1a',
        'ap-southeast-1b',
        'ap-southeast-1c',
      ],
      ipAddresses: IpAddresses.cidr('10.10.0.0/16'),
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'database-subnet',
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });
    this.dbSg = new SecurityGroup(this, 'dbsg', {
      vpc: this.vpc,
      allowAllOutbound: true,
    });
  }
}
