#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/vpc-stack';
import { AuroraStack } from '../lib/aurora-stack';

const app = new cdk.App();
const vpcStack = new VpcStack(app, 'vpc', {
  env: {
    region: 'ap-southeast-1',
  },
});
const auroraStack = new AuroraStack(app, 'aurora', {
  vpc: vpcStack.vpc,
  dbSg: vpcStack.dbSg,
  env: {
    region: 'ap-southeast-1',
  },
});
