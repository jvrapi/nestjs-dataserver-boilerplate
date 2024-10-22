import 'dotenv/config';
import 'newrelic';

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ReflectionService } from '@grpc/reflection';
import { INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';

import { GrpcExceptionFilter } from './presentation/grpc/filters/grpc-exception.filter';
import { AppModule } from './presentation/modules/app.module';

const getProtoPaths = () => {
  const protoPath = join(__dirname, 'presentation/grpc/protos');
  const protoFiles = readdirSync(protoPath);
  return protoFiles.map((filename) => join(protoPath, filename));
};

const getProtoPackages = () => {
  const protoPaths = getProtoPaths();
  return protoPaths.map((path) => {
    const file = readFileSync(path, 'utf8');
    return file
      .split(/\r?\n|\r|\n/g)
      .find((s) => s.includes('package'))
      .replace('package ', '')
      .replace(';', '');
  });
};

async function bootstrap() {
  const app: INestMicroservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:50051',
        package: getProtoPackages(),
        protoPath: getProtoPaths(),
        onLoadPackageDefinition: (pkg, server) => {
          new ReflectionService(pkg).addToServer(server);
        },
      },
      bufferLogs: true,
    });

  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new GrpcExceptionFilter());

  await app.listen();
}
bootstrap();
