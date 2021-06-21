import { AsyncUseCase } from '@benkeil/typescript-usecase/dist/AsyncUseCase';
import LoginForDeviceUseCaseRequest from './LoginForDeviceUseCaseRequest';
import Result from '@benkeil/typescript-result/dist/Result';
import { ChangeMacAddressToDeviceUseCase } from '../change-mac-address/ChangeMacAddressToDeviceUseCase';
import CaptiveLoginUseCase from '../captive-login/CaptiveLoginUseCase';
import sleep from '@benkeil/typescript-commons-lang/dist/time/sleep';
import Duration from '@benkeil/typescript-commons-lang/dist/time/Duration';
import LoginService from '../../services/LoginService';

export class LoginForDeviceUseCase implements AsyncUseCase<LoginForDeviceUseCaseRequest, Promise<Result<void>>> {
  private static readonly RETRIES = 3;
  constructor(
    private readonly changeMacAddressToDeviceUseCase: ChangeMacAddressToDeviceUseCase,
    private readonly captiveLoginUseCase: CaptiveLoginUseCase,
    private readonly loginService: LoginService,
  ) {}

  async execute<R>(
    inputPort: () => LoginForDeviceUseCaseRequest,
    outputPort: (result: Promise<Result<void>>) => Promise<R>,
  ): Promise<R> {
    console.log('### execute LoginForDeviceUseCase ###');
    return outputPort(
      Result.wrapAsync(async () => {
        console.log('### wrapAsync ###');
        const sudoUserPassword = await this.loginService.getSudoUserPassword();
        const { networkInterface, thisDeviceId, deviceId, debug, providerId } = inputPort();
        // Change mac address to other device
        for (let i = 0; i <= LoginForDeviceUseCase.RETRIES; i++) {
          console.log(`attempt #${i} to change mac address`);
          await this.changeMacAddressToDeviceUseCase.execute(
            () => ({
              changeToDeviceId: deviceId,
              networkInterface,
              sudoUserPassword,
            }),
            async (result) => (await result).get(),
          );
        }
        await sleep(Duration.ofSeconds(5));
        // Login into WiFi
        await this.captiveLoginUseCase.execute(
          () => ({
            debug,
            providerId,
          }),
          async (result) => (await result).ifFailure((error) => console.error(`Could not login user - Exception caught:`, error)),
        );
        // Change mac address back to value before
        for (let i = 0; i <= LoginForDeviceUseCase.RETRIES; i++) {
          console.log(`attempt #${i} to change mac address`);
          await this.changeMacAddressToDeviceUseCase.execute(
            () => ({
              changeToDeviceId: thisDeviceId,
              networkInterface,
              sudoUserPassword,
            }),
            async (result) => (await result).get(),
          );
        }
      }),
    );
  }
}
