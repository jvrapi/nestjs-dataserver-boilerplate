import { Greeting } from '@/core/entities/greeting.entity';
import { InvalidArgumentException } from '@/core/exceptions/invalid-argument.exception';

export class SayHelloService {
  execute = async (name: string): Promise<string> => {
    if (!name) throw new InvalidArgumentException('prop name is required.');
    return new Greeting(name).say;
  };
}
