import ProviderRepository from '@project/core/src/repositories/ProviderRepository';
import { Optional } from 'typescript-optional';
import Provider from '@project/core/src/entities/Provider';

export default class MockProviderRepository implements ProviderRepository {
  private providers: readonly Provider[] = [
    {
      url: 'http://10.0.0.1',
      id: 'cassia',
      name: 'Cassis Phuket',
      input: {
        'input[name=username]': '612',
        'input[name=password]': 'Keil',
        'input[name=email]': 'a@a.de',
      },
      clickSelector: 'button[type=button]',
    },
  ];

  getById(id: string): Optional<Provider> {
    return Optional.ofNullable(this.providers.find((provider) => provider.id === id));
  }
}
