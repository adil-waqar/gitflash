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
const clui_1 = require("clui");
const fs_1 = __importDefault(require("fs"));
const touch_1 = __importDefault(require("touch"));
const lodash_1 = __importDefault(require("lodash"));
const inquirer_1 = __importDefault(require("./inquirer"));
const github_1 = __importDefault(require("./github"));
const simple_git_1 = __importDefault(require("simple-git"));
exports.default = {
    createRemoteRepo: () => __awaiter(void 0, void 0, void 0, function* () {
        const github = github_1.default.getInstance();
        const answers = yield inquirer_1.default.askRepoDetails();
        const data = {
            name: answers.name,
            description: answers.description,
            private: answers.visibility === 'private'
        };
        const status = new clui_1.Spinner('Creating a remote repository');
        status.start();
        try {
            const response = yield github.repos.createForAuthenticatedUser(data);
            return response.data.html_url;
        }
        finally {
            status.stop();
        }
    }),
    createGitignore: () => __awaiter(void 0, void 0, void 0, function* () {
        const filelist = lodash_1.default.without(fs_1.default.readdirSync('.'), '.git', '.gitignore');
        if (filelist.length) {
            const answers = yield inquirer_1.default.askIgnoreFiles(filelist);
            if (answers.ignore.length)
                fs_1.default.writeFileSync('.gitignore', answers.ignore.join('\n'));
            else
                touch_1.default('.gitignore');
        }
        else {
            touch_1.default('.gitignore');
        }
    }),
    setupRepo: (url) => __awaiter(void 0, void 0, void 0, function* () {
        const status = new clui_1.Spinner('Initializing local repository and pushing to remote');
        status.start();
        const git = simple_git_1.default();
        try {
            yield git.init();
            yield git.add('.gitignore');
            yield git.commit('Initial commit');
            yield git.addRemote('origin', url);
            yield git.push('origin', 'master');
        }
        finally {
            status.stop();
        }
    }),
    pushAllToRepo: (commitMessage) => __awaiter(void 0, void 0, void 0, function* () {
        const status = new clui_1.Spinner('Pushing everything to remote...');
        status.start();
        const git = simple_git_1.default();
        try {
            yield git.add('.');
            yield git.commit(commitMessage);
            yield git.push('origin', 'master');
        }
        finally {
            status.stop();
        }
    })
};
