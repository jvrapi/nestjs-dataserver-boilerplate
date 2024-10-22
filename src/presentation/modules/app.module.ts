import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { SayHelloService } from '@/core/services/hello/say-hello.service';
import { GreeterController } from '@/presentation/grpc/controllers/greeter.controller';

import { HealthModule } from './health.module';
import { makeInjectable } from './helpers/make-injectable.helper';
const { NODE_ENV, LOG_LEVEL } = process.env;

const isProduction = ['prod', 'production'].includes(NODE_ENV ?? '');

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        name: 'DATASERVER BOILERPLATE',
        level: LOG_LEVEL ?? 'info',
        transport: isProduction
          ? undefined
          : {
              target: 'pino-pretty',
              options: {
                singleLine: true,
              },
            },
      },
    }),
    HealthModule,
  ],
  controllers: [GreeterController],
  providers: [makeInjectable(SayHelloService)],
})
export class AppModule {}
