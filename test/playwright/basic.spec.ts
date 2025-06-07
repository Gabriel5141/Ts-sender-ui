import basicSetup from "../wallet-setup/basic.setup"
import { testWithSynpress } from "@synthetixio/synpress"
import { MetaMask, metamaskFixtures } from "@synthetixio/synpress/cypress"


const test = testWithSynpress(metamaskFixtures(basicSetup))
const { expect } = test

test('has title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/TSender/);
});

test("should show the airdropform when connected, otherwise, not", async ({ page, context, metamaskPage, 
  extensionId }) => { 
 
  await page.goto('/')
  await expect(page.getByText('Please connect')).toBeVisible();

  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword, extensionId)
  await page.getByTestId('rk-connect-Button').click()
  await page.getByTestId('rk-wallet-option-io.metamask').waitFor({
    state: 'visible'
    timeout: 30000
  })
  await page.getByTestId('rk-wallet-option-io.metamask').click()
  await metamask.connectToDapp()

  const customNetwork = {
    name: 'Anvil',
    rpUrl: 'http://127.0.0.1:8545',
    chainId: 31337,
    symbol: 'ETH',
  }
  await metamask.addNetwork(customNetwork)

  await expect(page.getByText("Token Address")).toBeVisible();

})