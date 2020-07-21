import inquirer, { Answers } from 'inquirer';
import files from './files';

export default {
  askGithubCredentials: (): Promise<{
    username: string;
    password: string;
  }> => {
    const questions = [
      {
        name: 'username',
        type: 'input',
        message: 'Enter your Github username or e-mail address',
        validate: (value: string): string | Boolean => {
          return value.length
            ? true
            : 'Please enter your username or e-mail adress';
        }
      },
      {
        name: 'password',
        type: 'password',
        message: 'Please enter your password',
        validate: (value: string): string | Boolean => {
          return value.length ? true : 'Please enter your password';
        }
      }
    ];

    return inquirer.prompt(questions);
  },

  getTwoFactorAuthenticationCode: (): Promise<{
    twoFactorAuthenticationCode: string;
  }> => {
    return inquirer.prompt({
      name: 'twoFactorAuthenticationCode',
      type: 'input',
      message: 'Enter your two-factor authentication code:',
      validate: (value) => {
        return value.length ? true : 'Please enter your 2FA code';
      }
    });
  },

  askRepoDetails: (): Promise<{
    name: string;
    description: string | null;
    visibility: string;
  }> => {
    const argv = require('minimist')(process.argv.slice(2));

    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Please enter a name for your repo',
        default: argv._[0] || files.getCurrentDirectoryBase(),
        validate: (value) => {
          return value.length
            ? true
            : 'Please enter a name for your repository';
        }
      },
      {
        type: 'input',
        name: 'description',
        default: argv._[1] || null,
        message: 'Optionally enter a description for your repository'
      },
      {
        type: 'list',
        name: 'visibility',
        message: 'Public or private?',
        choices: ['public', 'private'],
        default: 'public'
      }
    ];
    return inquirer.prompt(questions);
  },
  askIgnoreFiles: (filelist: Array<string>): Promise<Answers> => {
    const questions = [
      {
        type: 'checkbox',
        name: 'ignore',
        message: 'Select the files and/or folders you wish to ignore',
        choices: filelist,
        default: ['node_modules', 'bower_components']
      }
    ];

    return inquirer.prompt(questions);
  }
};
