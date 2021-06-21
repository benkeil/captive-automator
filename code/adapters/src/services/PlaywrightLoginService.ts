import LoginService from '@project/core/src/services/LoginService';
import { chromium } from 'playwright';
import prompt from 'prompt';
import Provider from '@project/core/src/entities/Provider';
import LoginOptions from '@project/core/src/entities/LoginOptions';
import RuntimeError from '@benkeil/typescript-commons-lang/dist/error/RuntimeError';

export default class PlaywrightLoginService implements LoginService {
  async login(provider: Provider, options?: LoginOptions): Promise<void> {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(provider.url, { timeout: 3000 });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (options?.debug) {
      await page.screenshot({ path: PlaywrightLoginService.screenshotName(provider, 'before') });
    }
    const entries = Array.from(Object.entries(provider.input));
    for (const entry of entries) {
      const [selector, value] = entry;
      await page.fill(selector, value);
    }
    if (options?.debug) {
      await page.screenshot({ path: PlaywrightLoginService.screenshotName(provider, 'filled') });
    }
    await page.click(provider.clickSelector);
    if (options?.debug) {
      await page.screenshot({ path: PlaywrightLoginService.screenshotName(provider, 'clicked') });
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await browser.close();
  }

  private static screenshotName(provider: Provider, when: 'before' | 'filled' | 'clicked'): string {
    return `src/resources/screenshots/${provider.id}-${when}.png`;
  }

  async getSudoUserPassword(): Promise<string> {
    prompt.start();
    try {
      const { password } = await prompt.get<{ password: string }>(['password']);
      return password;
    } catch (e) {
      throw new RuntimeError({ message: 'Coul dnot get password.', type: 'invalid_value', cause: e });
    }
  }
}
