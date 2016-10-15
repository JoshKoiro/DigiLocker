# DigiLocker

DigiLocker is a CLI (command line interface) application that is designed to **generate, manage, and store passwords** for accounts, and websites. Since DigiLocker runs in the terminal, it's fast, and doesn't get in the way of what the user is doing by making it easy to maintain very secure passwords with the convenience technology provides.

### Current Features

- [x] **offline operation for maximum security**

- [x] **passwords are able to be easily copied out of DigiLocker and pasted into a form or login page**

- [x] **Able to generate random passwords with control over character selections**

### Features in the works

- [ ] **Password generator that manipulates user input to generate memorable, secure passwords**

- [ ] **passwords saved to encrypted data file which can easily be transferred to and from other computers**

- [ ] **global installation for quick access from any point in a terminal session**

## Installation

Currently, this project must be installed using a terminal running node's npm package manager. You can download the latest version of node.js at https://nodejs.org.

the first step is to clone the repository onto your local machine:

`git clone https://github.com/JoshKoiro/password-gen.git`

Next, navigate to the newly created folder and run:

`npm install`

This will install the required dependencies noted in the package.json file.
<!-- Potentially add a comment about needing to install copy-paste globally -->

to run the program, use the following command in the root directory:

`node index.js`

### Note:

If you run into a problem running the copy function, you may need to change a line in node modules folder called copy-paste. It can be found in `./node modules/copy-paste/index.js` Inside this file, line 112 and 113 may look like this:

``` javascript
GLOBAL.copy = exports.copy;
GLOBAL.paste = exports.paste;

```

All you need to do is change the `GLOBAL` object to be `global` so it would look like this:

```javascript
global.copy = exports.copy;
global.paste = exports.paste;
```

***If anyone could let me know how to fix this so that this process will not need to be done, I would be appreciative!***

## Usage

DigiLocker is built off the Vorpal.js framework. This framework is powerful to create immersive command-line-interface (CLI) applications with little effort. Once you start DigiLocker, type `help` in the prompt to get a list of all the commands. You may also get further instruction for each command by typing `help` followed by the command keyword like this:

`help list`

This will return specific instruction about the list command.
