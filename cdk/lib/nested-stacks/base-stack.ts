import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class BaseStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;
  public readonly cartApp: NodejsFunction;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.cartApp = new NodejsFunction(this, 'LambdaCartApp', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: 'dist/main.js',
      functionName: 'cart-app',
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
    });

    this.api = new apigateway.RestApi(this, 'CartRestApi', {
      restApiName: 'cart-rest-api',
      deploy: false,
      defaultCorsPreflightOptions: {
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
      },
    });
    this.api.root.addProxy({
      anyMethod: true,
      defaultIntegration: new apigateway.LambdaIntegration(this.cartApp),
    });
  }
}
