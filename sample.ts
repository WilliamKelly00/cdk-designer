/**
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class MyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC
    const vpc = new ec2.Vpc(this, 'MyVpc');

    // Create an S3 bucket
    const bucket = new s3.Bucket(this, 'MyBucket');

    // Create a Lambda function
    const lambdaFunction = new lambda.Function(this, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      vpc: vpc,
    });

    // Create an API Gateway
    const api = new apigateway.LambdaRestApi(this, 'MyApi', {
      handler: lambdaFunction,
    });

    // Grant the Lambda function permissions to access the S3 bucket
    bucket.grantReadWrite(lambdaFunction);
  }
}
*/