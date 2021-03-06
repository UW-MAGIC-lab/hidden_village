# Hidden Village Project

## Getting started
First, we need to clone the repository (`git clone git@github.com:UW-MAGIC-lab/hidden_village.git`). We recommend you clone using SSH. If you don't have SSH configured to work with github, you can follow [these instructions](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent).

## WINDOWS INSTRUCTIONS
Please install [WSL](https://docs.microsoft.com/en-us/windows/wsl/install) before proceeding.

## Create a development build of the app

There are few prerequisite pieces of software you will need to get started:
 - [installation of NVM](https://github.com/nvm-sh/nvm#installing-and-updating)
 - [installation of node](https://github.com/nvm-sh/nvm#usage)
 - [yarn](https://yarnpkg.com/getting-started/install)

After you installed yarn, you `cd` into the hidden_village directory (if you're not already there) and run:
```
yarn set version berry
yarn install
```

This should set your yarn version and then install all the dependencies for the project in order to proceed.

### Run a dev server
To serve the app locally, run `yarn run dev` and visit localhost:1234
