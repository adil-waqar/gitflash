#! node

import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import files from './lib/files';
import github from './lib/github';
import repo from './lib/repo';
import { program } from 'commander';

clear(); // Clear the screen

console.log(
  chalk.yellow(figlet.textSync('Gitflash!', { horizontalLayout: 'full' }))
);

program
  .version('0.0.1', '-v, --version', 'Version number for Gitflash')
  .option(
    '-r, --remove-token',
    'Removes the stored Github token from configuration store.'
  )
  .option(
    '-p, --push <commitMessage>',
    'Executes "git add .", "git commit -m <Your commit message>" and "git push origin master", ALL TOGETHER!'
  )
  .helpOption('-h, --help', 'Wiki for Gitflash CLI.');

// Invokes the default commands immediately and exits the process.
program.parse(process.argv);

const getGithubToken = async (): Promise<string> => {
  let token = github.getStoredGithubToken();
  if (token) return token;

  token = await github.getPersonalAccessToken();
  return token;
};

const run = async (): Promise<void> => {
  if (files.directoryExists('.git')) {
    console.log(chalk.red('Already a Git respository!'));
    process.exit();
  }

  try {
    // Retrieve & Set Authentication Token
    const token = await getGithubToken();
    github.githubAuth(token);

    // Create a remote repo
    const url = await repo.createRemoteRepo();

    // Create a .gitignore file
    await repo.createGitignore();

    // Setup a local repo and push to remote
    await repo.setupRepo(url);

    console.log(chalk.green('All done!'));
  } catch (err) {
    if (err) {
      switch (err.status) {
        case 401:
          console.log(
            chalk.red(
              "Couldn't log you in. Please provide correct credentials/token."
            )
          );
          break;
        case 422:
          console.log(
            chalk.red(
              'There is already a remote repository or token with the same name'
            )
          );
          break;
        default:
          console.log(chalk.red(err));
      }
    }
  }
};

const handleCLIArgs = async () => {
  try {
    if (program.removeToken) {
      github.removeStoredGithubuToken();
      console.log(chalk.green('Token removed successfully!'));
    }
    if (program.push) {
      await repo.pushAllToRepo(program.push);
      console.log(chalk.green('Pushed your code to remote.'));
    }
  } catch (err) {
    console.log(chalk.red(`Something went wrong! Error: ${err}`));
  }
};

if (process.argv.length > 2) {
  handleCLIArgs();
} else run();
