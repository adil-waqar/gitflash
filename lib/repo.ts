import { Spinner } from 'clui';
import fs from 'fs';
import touch from 'touch';
import _ from 'lodash';
import inquirer from './inquirer';
import gh from './github';
import simpleGit from 'simple-git';

export default {
  createRemoteRepo: async (): Promise<string> => {
    const github: any = gh.getInstance();
    const answers = await inquirer.askRepoDetails();

    const data = {
      name: answers.name,
      description: answers.description,
      private: answers.visibility === 'private'
    };

    const status = new Spinner('Creating a remote repository');
    status.start();

    try {
      const response = await github.repos.createForAuthenticatedUser(data);
      return response.data.html_url;
    } finally {
      status.stop();
    }
  },
  createGitignore: async (): Promise<void> => {
    const filelist = _.without(fs.readdirSync('.'), '.git', '.gitignore');

    if (filelist.length) {
      const answers = await inquirer.askIgnoreFiles(filelist);

      if (answers.ignore.length)
        fs.writeFileSync('.gitignore', answers.ignore.join('\n'));
      else touch('.gitignore');
    } else {
      touch('.gitignore');
    }
  },
  setupRepo: async (url: string): Promise<void> => {
    const status: Spinner = new Spinner(
      'Initializing local repository and pushing to remote'
    );

    status.start();
    const git = simpleGit();

    try {
      await git.init();
      await git.add('.gitignore');
      await git.commit('Initial commit');
      await git.addRemote('origin', url);
      await git.push('origin', 'master');
    } finally {
      status.stop();
    }
  },
  pushAllToRepo: async (commitMessage: string): Promise<void> => {
    const status: Spinner = new Spinner('Pushing everything to remote...');
    status.start();
    const git = simpleGit();

    try {
      await git.add('.');
      await git.commit(commitMessage);
      await git.push('origin', 'master');
    } finally {
      status.stop();
    }
  }
};
