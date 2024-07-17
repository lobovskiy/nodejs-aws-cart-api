import { NestFactory } from '@nestjs/core';
import { configure } from '@codegenie/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import helmet from 'helmet';
import 'dotenv/config';

import { AppModule } from './app.module';

let server: Handler;
const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return configure({ app: expressApp });
}
bootstrap().then(() => {
  console.log('App is running on %s port', port);
});

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  console.log(`Cart API requested with event: ${JSON.stringify(event)}`);

  server = server ?? (await bootstrap());

  return server(event, context, callback);
};
