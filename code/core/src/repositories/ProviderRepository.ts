import { Optional } from 'typescript-optional';
import Provider from '../entities/Provider';

export default interface ProviderRepository {
  getById(id: string): Optional<Provider>;
}
