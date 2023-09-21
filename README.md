![Example Image](/public/banner.png)

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

# Panda Wallet | Non-Custodial Web3 Wallet For BSV

Panda Wallet is an open-source and non-custodial web3 wallet for Bitcoin SV (BSV) and [1Sat Ordinals](https://docs.1satordinals.com/). This wallet allows users to have full control over their funds, providing security and independence in managing their assets.

## Features

- 🔑 **Non-Custodial:** Your private keys are encrypted and stored locally on your device, ensuring complete control over your funds.
- 😎 **User-Friendly:** A user-friendly interface makes asset management a breeze.
- ✅ **BSV Support:** Receive and Send BSV payments.
- 🟡 **1Sat Ordinals:** Full support for sending and transferring 1Sat Ordinals.
- 🔐 **Secure:** Open Source and audited by the community.

## Getting Started (Alpha)

The alpha version of the wallet is open and available to all users. While it has been tested, it is still new software so use at your own risk. The plan once out of alpha/beta is to launch on the Google Chrome Store.

1. **Download:** First you will need to <a id="raw-url" href="https://github.com/Panda-Wallet/panda-wallet/raw/main/public/builds/pw-0.0.2.zip" download="panda-wallet-0.0.2.zip">Download The Current Build</a>
   . \*\*Always double check that you are at the official Panda Wallet github repo before downloading anything. https://github.com/Panda-Wallet/panda-wallet.

   **v0.0.2 SHA256 Checksum:** For extra security you can check the checksum:

   `e3a7d8458f0f31be2a3eff41ce2a198b436e43344fdfa90af98b49ee32dec0fe`

   Files can also be found in `public/builds`

2. **Unzip:** Unzip the build zip file then head to [Chrome Extensions](chrome://extensions)
3. **Load The Build File:** In the top right of Chrome Extensions, enable dev mode, then on the left select "Load unpacked".
4. **Finish:** If you did this properly, you should now see Panda Wallet available in the list of extensions. You can now manage and pin the extension just like you would any other Chrome extension you have.

## Development

If you'd like to contribute to Panda Wallet's development, follow these steps:

1. **Clone the Repository:** Clone the repo:

   ```bash
   git clone
   ```

2. **Install Dependencies:** Navigate to the project's root directory and run:

   ```bash
   npm install
   ```

3. **Start the App:** Open a local instance of the app:

   ```bash
   npm run start
   ```

4. **Build The Extension:** To create a production build of the app, run:

   ```bash
   npm run build
   ```

5. **Run The Extension:** Load the extension into your browser using dev mode:

   1. Navigate to [Chrome Extensions](chrome://extensions/) and turn on dev mode.
   2. Click "Load Unpacked".
   3. Upload the production `build` folder.

6. **Customize and Contribute:**: Customize the extension or contribute by opening pull requests.

**\*Always Use Prettier for Code Formatting**

Prettier is a powerful code formatter that helps ensure our code remains well-organized and readable. By adhering to Prettier's formatting standards, we can enhance code collaboration and reduce potential errors. Make it a habit to run Prettier before committing any code changes.

**\*If you plan to contribute, please review the PR Guidelines**

[PR Guidelines](PR_GUIDELINES.md)

## Submit Issues or Feature Requests

Submit issues to the [Kanban Board](https://github.com/orgs/Panda-Wallet/projects/1)

## Support The Project

**BSV:** `1EqibN8PLLmeY61thwmekx9CjY1xJt6EEq`

## License

Panda Wallet is released under the [MIT License](https://opensource.org/licenses/MIT)
