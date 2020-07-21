"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clui_1 = __importDefault(require("clui"));
const configstore_1 = __importDefault(require("configstore"));
const rest_1 = require("@octokit/rest");
const auth_basic_1 = require("@octokit/auth-basic");
const inquirer_1 = __importDefault(require("./inquirer"));
const Spinner = clui_1.default.Spinner;
const conf = new configstore_1.default('gitflash');
let octokit;
exports.default = {
    getStoredGithubToken: () => {
        return conf.get('github.token');
    },
    removeStoredGithubuToken: () => {
        conf.delete('github.token');
    },
    githubAuth: (token) => {
        octokit = new rest_1.Octokit({ auth: token });
    },
    getInstance: () => {
        return octokit;
    },
    getPersonalAccessToken: () => __awaiter(void 0, void 0, void 0, function* () {
        const credentials = yield inquirer_1.default.askGithubCredentials();
        const status = new Spinner('Authenticating you, please wait...');
        status.start();
        const auth = auth_basic_1.createBasicAuth({
            username: credentials.username,
            password: credentials.password,
            on2Fa: () => __awaiter(void 0, void 0, void 0, function* () {
                status.stop();
                const res = yield inquirer_1.default.getTwoFactorAuthenticationCode();
                return res.twoFactorAuthenticationCode;
            }),
            token: {
                scopes: ['user', 'public_repo', 'repo', 'repo:status'],
                note: 'gitflash, the command-line for initializing Git repos!'
            }
        });
        try {
            const response = yield auth();
            if (response.token) {
                conf.set('github.token', response.token);
                return response.token;
            }
            else {
                throw new Error('Github token was not found in the response :(');
            }
        }
        finally {
            status.stop();
        }
    })
};
