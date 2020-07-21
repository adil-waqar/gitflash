"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const files_1 = __importDefault(require("./files"));
exports.default = {
    askGithubCredentials: () => {
        const questions = [
            {
                name: 'username',
                type: 'input',
                message: 'Enter your Github username or e-mail address',
                validate: (value) => {
                    return value.length
                        ? true
                        : 'Please enter your username or e-mail adress';
                }
            },
            {
                name: 'password',
                type: 'password',
                message: 'Please enter your password',
                validate: (value) => {
                    return value.length ? true : 'Please enter your password';
                }
            }
        ];
        return inquirer_1.default.prompt(questions);
    },
    getTwoFactorAuthenticationCode: () => {
        return inquirer_1.default.prompt({
            name: 'twoFactorAuthenticationCode',
            type: 'input',
            message: 'Enter your two-factor authentication code:',
            validate: (value) => {
                return value.length ? true : 'Please enter your 2FA code';
            }
        });
    },
    askRepoDetails: () => {
        const argv = require('minimist')(process.argv.slice(2));
        const questions = [
            {
                type: 'input',
                name: 'name',
                message: 'Please enter a name for your repo',
                default: argv._[0] || files_1.default.getCurrentDirectoryBase(),
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
        return inquirer_1.default.prompt(questions);
    },
    askIgnoreFiles: (filelist) => {
        const questions = [
            {
                type: 'checkbox',
                name: 'ignore',
                message: 'Select the files and/or folders you wish to ignore',
                choices: filelist,
                default: ['node_modules', 'bower_components']
            }
        ];
        return inquirer_1.default.prompt(questions);
    }
};
