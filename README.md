<!-- PROJECT LOGO -->
<br />
<p align="center">

  <h3 align="center">GitFlash</h3>

  <p align="center">
    This is git BUT doesn't repeats itself.
    <br />
  </p>
</p>

<!-- ABOUT THE PROJECT -->

## About The Project

Gitflash is a CLI tool that helps in not re-executing the same set of git commands that you do for your every project. Gitflash helps you initialize your git repository for a new project, creates the remote repository on Github, creates a .gitignore file and makes the first push for remote, ALL TOGETHER! With just a single command.

**Note:** This is a remake for the actual code [here](https://github.com/sitepoint-editors/ginit) which was coded by [Lukas White](https://github.com/lukaswhite). This is the TypeScript variant for the actual **ginit** which was originally coded in JavaScript. Also, I've added a few more features as a cherry on top.

### Built With

- [Nodejs](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/index.html)
- [Inquirer](https://www.npmjs.com/package/inquirer)

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- Nodejs
- npm

### Installation

1. Clone the repo

2. Install via NPM globally so that `gitflash` is available from everywhere.

```sh
npm install -g
```

## Usage

Using gitflash as as simple as eating a piece of cake. Just execute gitflash in the directory of your project like this

```sh
gitflash
```

Now, gitflash will ask you some questions regarding the repository you're trying to setup. You can also do something like

```sh
gitflash --help
```

And this will give you a few other usage details.

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License.

<!-- CONTACT -->

## Contact

Adil Waqar - <adil.waqar@hotmail.com> - Email
