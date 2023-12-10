import { RemovalPolicy, SecretValue, Stack, StackProps } from 'aws-cdk-lib';
import {
  ISecurityGroup,
  IVpc,
  InstanceClass,
  InstanceSize,
  InstanceType,
  SubnetType,
} from 'aws-cdk-lib/aws-ec2';
import {
  AuroraPostgresEngineVersion,
  ClusterInstance,
  Credentials,
  DBClusterStorageType,
  DatabaseCluster,
  DatabaseClusterEngine,
  NetworkType,
  StorageType,
} from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

interface AuroraProps extends StackProps {
  vpc: IVpc;
  dbSg: ISecurityGroup;
}

export class AuroraStack extends Stack {
  constructor(scope: Construct, id: string, props: AuroraProps) {
    super(scope, id, props);
    const rdsPostgres = new DatabaseCluster(this, 'rds-postgres', {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_15_3,
      }),
      defaultDatabaseName: 'vietaws',
      credentials: Credentials.fromUsername('dbadmin', {
        password: SecretValue.unsafePlainText('vietaws2023'),
      }),
      removalPolicy: RemovalPolicy.DESTROY,
      networkType: NetworkType.IPV4,
      storageType: DBClusterStorageType.AURORA_IOPT1,
      vpc: props.vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED, onePerAz: true },
      securityGroups: [props.dbSg],

      writer: ClusterInstance.provisioned('writer', {
        instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.MEDIUM),
      }),
      readers: [
        ClusterInstance.provisioned('reader1', {
          instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.MEDIUM),
        }),
        ClusterInstance.provisioned('reader2', {
          instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.MEDIUM),
        }),
      ],
    });
  }
}
