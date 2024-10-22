export function makeInjectable(
  InjectableClass: any,
  providersToken: string[] = [],
) {
  return {
    provide: InjectableClass,
    useFactory: (...providers: unknown[]) => new InjectableClass(...providers),
    inject: [...providersToken],
  };
}
