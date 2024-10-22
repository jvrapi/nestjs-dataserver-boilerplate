import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { CustomLogger } from '@/core/logger/custom-logger';

enum ServingStatus {
  UNKNOWN = 0,
  SERVING = 1,
  NOT_SERVING = 2,
}

interface HealthCheckRequest {
  service: string;
}

interface HealthCheckResponse {
  status: ServingStatus;
}

@Controller()
export class HealthController {
  private logger = new CustomLogger(HealthController.name);
  constructor() {}

  @GrpcMethod('Health', 'Check')
  check(req: HealthCheckRequest): HealthCheckResponse {
    this.logger.log(req.service);
    return {
      status: ServingStatus.SERVING,
    };
  }

  @GrpcMethod('Health', 'Watch')
  watch(req: HealthCheckRequest): Observable<HealthCheckResponse> {
    this.logger.log(req.service);
    const observable = new Observable<HealthCheckResponse>((subscriber) => {
      subscriber.next({
        status: ServingStatus.SERVING,
      });
    });

    return observable;
  }
}
