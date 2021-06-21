export default interface NetworkInterfaceService {
  changeMacAddressOf(adapter: string, toMacAddress: string, sudoUserPassword: string): Promise<void>;
}
