import CaptiveLoginUseCaseRequest from './CaptiveLoginUseCaseRequest';
import Result from '@benkeil/typescript-result/dist/Result';
import ProviderNotFoundError from '../../errors/ProviderNotFoundError';
import ProviderRepository from '../../repositories/ProviderRepository';
import LoginService from '../../services/LoginService';
import { AsyncUseCase } from '@benkeil/typescript-usecase/dist/AsyncUseCase';

export default class CaptiveLoginUseCase implements AsyncUseCase<CaptiveLoginUseCaseRequest, Promise<Result<void>>> {
  constructor(private readonly providerRepository: ProviderRepository, private readonly loginService: LoginService) {}

  async execute<R>(
    inputPort: () => CaptiveLoginUseCaseRequest,
    outputPort: (result: Promise<Result<void>>) => Promise<R>,
  ): Promise<R> {
    return outputPort(
      Result.wrapAsync(async () => {
        const { providerId, debug } = inputPort();
        const provider = this.providerRepository.getById(providerId);
        await this.loginService.login(
          provider.orElseThrow(() => new ProviderNotFoundError(providerId)),
          {
            debug,
          },
        );
      }),
    );
  }
}
