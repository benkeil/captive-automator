import { Command } from 'commander';
import CaptiveLoginUseCase from '@project/core/src/use-cases/captive-login/CaptiveLoginUseCase';
import MockProviderRepository from '@project/adapters/src/repositories/MockProviderRepository';
import PlaywrightLoginService from '@project/adapters/src/services/PlaywrightLoginService';
import Result from '@benkeil/typescript-result/dist/Result';
import CaptiveLoginUseCaseRequest from '@project/core/src/use-cases/captive-login/CaptiveLoginUseCaseRequest';
import { AsyncOutputPortFunction } from '@benkeil/typescript-usecase/dist/AsyncUseCase';
import { LoginForDeviceUseCase } from '@project/core/src/use-cases/login-for-device/LoginForDeviceUseCase';
import { ChangeMacAddressToDeviceUseCase } from '@project/core/src/use-cases/change-mac-address/ChangeMacAddressToDeviceUseCase';
import MockDeviceRepository from '@project/adapters/src/repositories/MockDeviceRepository';
import MacOsNetworkInterfaceService from '@project/adapters/src/services/MacOsNetworkInterfaceService';
import LoginForDeviceUseCaseRequest from '@project/core/src/use-cases/login-for-device/LoginForDeviceUseCaseRequest';

const providerRepository = new MockProviderRepository();
const loginService = new PlaywrightLoginService();
const deviceRepository = new MockDeviceRepository();
const networkInterfaceService = new MacOsNetworkInterfaceService();
const captiveLoginUseCase = new CaptiveLoginUseCase(providerRepository, loginService);
const changeMacAddressToDeviceUseCase = new ChangeMacAddressToDeviceUseCase(
  deviceRepository,
  networkInterfaceService,
  loginService,
);
const loginForDeviceUseCase = new LoginForDeviceUseCase(changeMacAddressToDeviceUseCase, captiveLoginUseCase, loginService);

const cliPresenter: AsyncOutputPortFunction<Promise<Result<void>>, number> = async (promise) => {
  const result = await promise;
  result.ifFailure(console.error);
  return result.matches({
    success: () => 0,
    failure: () => -1,
  });
};

const program = new Command();

(async () => {
  program.name('Captive Automator').version('0.0.1');

  program
    .command('login <provider>')
    .description('Login into wifi')
    .option('--debug', 'if enabled, create screenshots', false)
    .action(async (provider, { debug }) => {
      console.log('### run login ###');
      const controller = (): CaptiveLoginUseCaseRequest => ({ providerId: provider, debug });
      const result = await captiveLoginUseCase.execute(controller, cliPresenter);
      console.log('status code:', result);
      process.exit(result);
    });

  program
    .command('login-for <provider>')
    .description('Login into Wifi for another device')
    .option('-i, --network-interface <network-interface>', 'the network interface that should be used', 'en0')
    .option('-t, --this-device-id <this-device-id>', 'the device id of the current machine', 'mac')
    .requiredOption('-f, --for-device-id <for-device-id>', 'the id of the device that should be logged in')
    .option('--debug', 'If enabled, create screenshots', false)
    .action(async (provider, { networkInterface, thisDeviceId, debug, forDeviceId }) => {
      console.log('### run login-for ###');
      const controller = (): LoginForDeviceUseCaseRequest => ({
        providerId: provider,
        debug,
        networkInterface,
        thisDeviceId,
        deviceId: forDeviceId,
      });
      const result = await loginForDeviceUseCase.execute(controller, cliPresenter);
      console.log('status code:', result);
      process.exit(result);
    });

  await program.parseAsync(process.argv);
})();
