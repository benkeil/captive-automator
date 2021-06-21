export default interface ChangeMacAddressToDeviceUseCaseRequest {
  networkInterface: string;
  changeToDeviceId: string;
  sudoUserPassword?: string;
}
