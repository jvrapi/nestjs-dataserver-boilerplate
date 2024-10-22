import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { CustomLogger } from '@/core/logger/custom-logger';
import { SayHelloService } from '@/core/services/hello/say-hello.service';

import { GreeterInput, GreeterResponse } from './dtos/greeter.dto';

@Controller()
export class GreeterController {
  private logger = new CustomLogger(GreeterController.name);

  constructor(private readonly service: SayHelloService) {}

  @GrpcMethod('Greeter', 'SayHello')
  async check({ name }: GreeterInput): Promise<GreeterResponse> {
    return {
      message: await this.service.execute(name),
    };
  }
}
