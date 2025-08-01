const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");

const UPDATE_URL = "https://raw.githubusercontent.com/HASAN-CEO-47/Jubayer-B0T/JUBAYER/updater.json";
const PKG_PATH = path.join(__dirname, "package.json");

(async function checkForUpdates() {
  try {
    console.log(chalk.blueBright("🔎 Checking for updates..."));

    const response = await axios.get(UPDATE_URL);
    const updateInfo = response.data;

    const localPkg = require(PKG_PATH);
    const localVersion = localPkg.version;

    if (localVersion === updateInfo.version) {
      console.log(chalk.greenBright("👍 You already have the latest version."));
      return;
    }

    console.log(chalk.yellowBright(`🚀 Update found! New version: ${updateInfo.version}`));

    for (let fileName of updateInfo.files) {
      const localFilePath = path.resolve(__dirname, fileName);
      const remoteFileLink = `https://raw.githubusercontent.com/HASAN-CEO-47/Jubayer-B0T/JUBAYER/${fileName}`;

      try {
        const fileResp = await axios.get(remoteFileLink);
        fs.mkdirpSync(path.dirname(localFilePath));
        fs.writeFileSync(localFilePath, fileResp.data, "utf-8");

        console.log(chalk.green(`✔ Updated: ${fileName}`));
      } catch (fileErr) {
        console.error(chalk.red(`✖ Failed to update file: ${fileName}`));
      }
    }

    localPkg.version = updateInfo.version;
    fs.writeFileSync(PKG_PATH, JSON.stringify(localPkg, null, 2), "utf-8");
    console.log(chalk.cyan(`✨ Version updated to ${updateInfo.version}`));

    if (updateInfo.reinstallDependencies) {
      console.log(chalk.blue("📦 Installing dependencies..."));
      const execSync = require("child_process").execSync;
      execSync("npm install", { stdio: "inherit" });
      console.log(chalk.green("✅ Dependencies installed successfully."));
    }

    console.log(chalk.greenBright("✅ Update process complete! Please restart your bot."));
  } catch (error) {
    console.error(chalk.red("❌ Update check failed:"), error.message);
  }
})();
