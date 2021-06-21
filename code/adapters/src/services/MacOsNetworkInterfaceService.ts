import { spawn } from 'child_process';
import NetworkInterfaceService from '@project/core/src/services/NetworkInterfaceService';

export default class MacOsNetworkInterfaceService implements NetworkInterfaceService {
  async changeMacAddressOf(adapter: string, toMacAddress: string, sudoUserPassword: string): Promise<void> {
    console.log('set mac address to:', toMacAddress);
    const ifConfig = spawn('sh', [
      '-c',
      `echo ${sudoUserPassword} | sudo -S bash -c 'ifconfig ${adapter} ether ${toMacAddress}'`,
    ]);
    await new Promise((resolve, reject) => {
      ifConfig.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

      ifConfig.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

      ifConfig.on('close', async (code) => {
        console.log(`child process exited with code ${code}`);
        if (code !== 0) {
          return reject(code);
        }
        return resolve(code);
      });
    });
  }
}
