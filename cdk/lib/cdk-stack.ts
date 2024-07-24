import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { BaseStack } from './nested-stacks/base-stack';
import { DevStageStack } from './nested-stacks/dev-stage-stack';
import { ProdStageStack } from './nested-stacks/prod-stage-stack';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const baseStack = new BaseStack(this, 'CartAppBaseStack');

    new DevStageStack(this, 'CartAppDevStageStack', {
      api: baseStack.api,
    });
    new ProdStageStack(this, 'CartAppProdStageStack', {
      api: baseStack.api,
    });
  }
}
