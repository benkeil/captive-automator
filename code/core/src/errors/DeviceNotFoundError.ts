import RuntimeError from '@benkeil/typescript-commons-lang/dist/error/RuntimeError';

export default class DeviceNotFoundError extends RuntimeError {
  constructor(deviceId: string) {
    super({
      message: `Device ${deviceId} not found.`,
      type: 'entity_not_found',
    });
  }
}
