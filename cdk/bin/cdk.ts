#!/usr/bin/env node
import * as path from 'node:path';
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as dotenv from 'dotenv';

import { CdkStack } from '../lib/cdk-stack';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const app = new cdk.App();
new CdkStack(app, 'CartAppCdkStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
