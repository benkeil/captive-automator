export default interface LoginForDeviceUseCaseRequest {
  readonly networkInterface: string;
  readonly thisDeviceId: string;
  readonly deviceId: string;
  readonly debug: boolean;
  readonly providerId: string;
}
