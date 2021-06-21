import Device from '../entities/Device';
import { Optional } from 'typescript-optional';

export default interface DeviceRepository {
  getById(deviceId: string): Optional<Device>;
}
