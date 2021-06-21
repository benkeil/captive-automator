import Provider from '../entities/Provider';
import LoginOptions from '../entities/LoginOptions';

export default interface LoginService {
  login(provider: Provider, options?: LoginOptions): Promise<void>;
  getSudoUserPassword(): Promise<string>;
}
