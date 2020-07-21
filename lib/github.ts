import CLI from 'clui';
import Configstore from 'configstore';
import { Octokit } from '@octokit/rest';
import { createBasicAuth } from '@octokit/auth-basic';
import inquirer from './inquirer';
const Spinner = CLI.Spinner;
const conf = new Configstore('gitflash');

let octokit: Octokit;

export default {
  getStoredGithubToken: (): string | undefined | null => {
    return conf.get('github.token');
  },

  removeStoredGithubuToken: (): void => {
    conf.delete('github.token');
  },

  githubAuth: (token: string) => {
    octokit = new Octokit({ auth: token });
  },

  getInstance: (): Octokit => {
    return octokit;
  },

  getPersonalAccessToken: async (): Promise<string> => {
    const credentials = await inquirer.askGithubCredentials();
    const status = new Spinner('Authenticating you, please wait...');

    status.start();

    const auth = createBasicAuth({
      username: credentials.username,
      password: credentials.password,
      on2Fa: async () => {
        status.stop();
        const res = await inquirer.getTwoFactorAuthenticationCode();
        return res.twoFactorAuthenticationCode;
      },
      token: {
        scopes: ['user', 'public_repo', 'repo', 'repo:status'],
        note: 'gitflash, the command-line for initializing Git repos!'
      }
    });

    try {
      const response: any = await auth();

      if (response.token) {
        conf.set('github.token', response.token);
        return response.token;
      } else {
        throw new Error('Github token was not found in the response :(');
      }
    } finally {
      status.stop();
    }
  }
};
