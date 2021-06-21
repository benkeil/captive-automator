import ChangeMacAddressToDeviceUseCaseRequest from './ChangeMacAddressToDeviceUseCaseRequest';
import DeviceRepository from '../../repositories/DeviceRepository';
import NetworkInterfaceService from '../../services/NetworkInterfaceService';
import { AsyncUseCase } from '@benkeil/typescript-usecase/dist/AsyncUseCase';
import DeviceNotFoundError from '../../errors/DeviceNotFoundError';
import Result from '@benkeil/typescript-result/dist/Result';
import LoginService from '../../services/LoginService';

export class ChangeMacAddressToDeviceUseCase
  implements AsyncUseCase<ChangeMacAddressToDeviceUseCaseRequest, Promise<Result<void>>>
{
  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly networkInterfaceService: NetworkInterfaceService,
    private readonly loginService: LoginService,
  ) {}

  async execute<R>(
    inputPort: () => ChangeMacAddressToDeviceUseCaseRequest,
    outputPort: (result: Promise<Result<void>>) => Promise<R>,
  ): Promise<R> {
    return outputPort(
      Result.wrapAsync(async () => {
        const { changeToDeviceId, networkInterface, sudoUserPassword } = inputPort();
        const password = sudoUserPassword ?? (await this.loginService.getSudoUserPassword());
        const optionalDevice = this.deviceRepository.getById(changeToDeviceId);
        const { macAddress } = optionalDevice.orElseThrow(() => new DeviceNotFoundError(changeToDeviceId));
        await this.networkInterfaceService.changeMacAddressOf(networkInterface, macAddress, password);
      }),
    );
  }
}
