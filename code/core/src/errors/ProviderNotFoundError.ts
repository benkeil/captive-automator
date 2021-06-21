import RuntimeError from '@benkeil/typescript-commons-lang/dist/error/RuntimeError';

export default class ProviderNotFoundError extends RuntimeError {
  constructor(providerId: string) {
    super({
      message: `Provider ${providerId} not found.`,
      type: 'entity_not_found',
    });
  }
}
