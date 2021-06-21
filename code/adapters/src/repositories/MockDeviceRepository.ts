import DeviceRepository from '@project/core/src/repositories/DeviceRepository';
import Device from '@project/core/src/entities/Device';
import { Optional } from 'typescript-optional';

export default class MockDeviceRepository implements DeviceRepository {
  private devices: readonly Device[] = [
    {
      id: 'mac',
      macAddress: '1c:36:bb:84:80:49',
    },
    {
      id: 'alexa',
      macAddress: '4c:ef:c0:02:bb:44',
    },
  ];
  getById(deviceId: string): Optional<Device> {
    return Optional.ofNullable(this.devices.find((device) => device.id === deviceId));
  }
}
