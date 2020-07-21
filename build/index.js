#! node
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
const chalk_1 = __importDefault(require("chalk"));
const clear_1 = __importDefault(require("clear"));
const figlet_1 = __importDefault(require("figlet"));
const files_1 = __importDefault(require("./lib/files"));
const github_1 = __importDefault(require("./lib/github"));
const repo_1 = __importDefault(require("./lib/repo"));
const commander_1 = require("commander");
clear_1.default(); // Clear the screen
console.log(chalk_1.default.yellow(figlet_1.default.textSync('Gitflash!', { horizontalLayout: 'full' })));
commander_1.program
    .version('0.0.1', '-v, --version', 'Version number for Gitflash')
    .option('-r, --remove-token', 'Removes the stored Github token from configuration store.')
    .option('-p, --push <commitMessage>', 'Executes "git add .", "git commit -m <Your commit message>" and "git push origin master", ALL TOGETHER!')
    .helpOption('-h, --help', 'Wiki for Gitflash CLI.');
// Invokes the default commands immediately and exits the process.
commander_1.program.parse(process.argv);
const getGithubToken = () => __awaiter(void 0, void 0, void 0, function* () {
    let token = github_1.default.getStoredGithubToken();
    if (token)
        return token;
    token = yield github_1.default.getPersonalAccessToken();
    return token;
});
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    if (files_1.default.directoryExists('.git')) {
        console.log(chalk_1.default.red('Already a Git respository!'));
        process.exit();
    }
    try {
        // Retrieve & Set Authentication Token
        const token = yield getGithubToken();
        github_1.default.githubAuth(token);
        // Create a remote repo
        const url = yield repo_1.default.createRemoteRepo();
        // Create a .gitignore file
        yield repo_1.default.createGitignore();
        // Setup a local repo and push to remote
        yield repo_1.default.setupRepo(url);
        console.log(chalk_1.default.green('All done!'));
    }
    catch (err) {
        if (err) {
            switch (err.status) {
                case 401:
                    console.log(chalk_1.default.red("Couldn't log you in. Please provide correct credentials/token."));
                    break;
                case 422:
                    console.log(chalk_1.default.red('There is already a remote repository or token with the same name'));
                    break;
                default:
                    console.log(chalk_1.default.red(err));
            }
        }
    }
});
const handleCLIArgs = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (commander_1.program.removeToken) {
            github_1.default.removeStoredGithubuToken();
            console.log(chalk_1.default.green('Token removed successfully!'));
        }
        if (commander_1.program.push) {
            yield repo_1.default.pushAllToRepo(commander_1.program.push);
            console.log(chalk_1.default.green('Pushed your code to remote.'));
        }
    }
    catch (err) {
        console.log(chalk_1.default.red(`Something went wrong! Error: ${err}`));
    }
});
if (process.argv.length > 2) {
    handleCLIArgs();
}
else
    run();
