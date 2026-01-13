const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

const REMOTE_REPO = 'fengluo/claude-write';
const REMOTE_BRANCH = 'master';
const RAW_BASE = `https://raw.githubusercontent.com/${REMOTE_REPO}/${REMOTE_BRANCH}`;

// System directories to manage during upgrade
const SYSTEM_DIRS = [
  'scripts',
  '.claude',
  '.vscode',
  'bin'
];

const SYSTEM_FILES = [
  'package.json',
  'README.md'
];

function log(msg, type = 'info') {
  const icons = { info: 'ℹ️', success: '✅', warn: '⚠️', error: '❌' };
  console.log(`${icons[type]} ${msg}`);
}

function checkGitStatus() {
  try {
    const origin = execSync('git remote get-url origin', { stdio: 'pipe' }).toString().trim();
    if (origin.includes('claude-write')) {
      return true;
    }
  } catch (e) {
    // Not a git repo or no origin
  }
  return false;
}

function getRemoteVersion() {
  return new Promise((resolve, reject) => {
    https.get(`${RAW_BASE}/package.json`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.version);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('🔄 Claude Write Update System');
  console.log('============================');

  // 1. Check installation method
  const isGitInstall = checkGitStatus();
  const localPackage = require('../../package.json');

  log(`Current version: ${localPackage.version}`);

  try {
    const remoteVersion = await getRemoteVersion();
    log(`Latest version:  ${remoteVersion}`);

    if (remoteVersion === localPackage.version) {
      log('You are already on the latest version.', 'success');
      return;
    }
  } catch (e) {
    log('Failed to check remote version. Please check internet connection.', 'error');
    return;
  }

  // 2. Handle Upgrade
  if (isGitInstall) {
    log('Detected git clone installation.', 'info');
    console.log('To upgrade, please run:');
    console.log('\n    git pull origin master && npm install\n');
  } else {
    log('Detected standalone installation.', 'info');
    log('Automatic upgrade for standalone installations is not yet fully implemented.', 'warn');
    log('Recommended upgrade path:', 'info');
    console.log('1. Backup your 00-05 directories and 06_Meta/Reviews');
    console.log('2. Create a new workspace with the latest version');
    console.log('3. Migrate your content folders to the new workspace');

    // TODO: Implement direct file download and overlay
    // This requires downloading a zipball from GitHub and extracting system folders
    // while preserving user config.
  }
}

main();
