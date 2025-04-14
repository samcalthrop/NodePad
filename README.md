# NodePad

> _A note-taking app made for the user to actively enjoy, whilst being both stimulating & productive_

<img src='./resources/welcomeVideo.gif' />

NodePad is an interactive live-markdown note taking app that incorporates the links between your notes into your workflow. You can use an interactive network of your notes to visualise how they all connect, with the ability to draw connections between each node (_note_), as well as being able to give each note tags.

A short list of features the app has is:

- Unique accounts for each user,
- Live, in-line rendering of markdown text,
- A network of your notes that can collide, bounce off one another and even mock the flocking behaviour of birds,
- Tagging,
- Theming,
- And much more!

## A-Level Writeup

The write-up for the project - all the required written work done throughout the development of the project - is in the [writeup](/writeup) folder. **_You only need to care about this part if you are OCR, or any of my teachers._**

Within the write-up are several folders, each corresponding to different parts of the development process:

- [Section 1](https://github.com/samcalthrop/NodePad/tree/main/writeup/1%20-%20Analysis) - Any planning/ research/ ideas formed **before any code is written**.
- [Section 2](https://github.com/samcalthrop/NodePad/tree/main/writeup/2%20-%20Iterative%20Development) - Each iterative stage of the development process, using the AGILE methodology.
- [Section 3](https://github.com/samcalthrop/NodePad/tree/main/writeup/3%20-%20Design) - The design of the app's front and back end.
- [Section 4](https://github.com/samcalthrop/NodePad/tree/main/writeup/4%20-%20Evaluation) - The post-development stage, where I run black box tests evaluate the app's success through a variety of measures.

## Project Setup

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) (_or any VS code forks_) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### Download

_Note: these instructions are all written in `bash`, so if using a different shell, you cannot just copy + paste._

To download the repository for local use, navigate to where you want to store the project in your file system, i.e:

```bash
$ cd ~/Desktop/MyProjects/
```

Then run the following:

```bash
$ git clone https://github.com/samcalthrop/NodePad.git
```

### Dependencies

To install all dependencies for the project, run the following command from within the project's root directory:

```bash
$ npm install
```

### Develop

```bash
$ npm run dev
```

### Build

```bash
# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux

# For windows
$ npm run build:win
```

### All in one

To download the repo, install dependencies and run the app in one go, run the following:

```bash
$ cd ~/Desktop/MyProjects/
$ git clone https://github.com/samcalthrop/NodePad.git
$ npm install && npm run dev
```

## Demo

A demo of most of the features the app includes is below. A list of these features is:

- Live, in-line rendering of markdown text,
- A network of your notes that can collide, bounce off one another and even mock the flocking behaviour of birds,
- Tags (_stored within a database_),
- Theme selection,
- A log in and signup system (_details stored in a database_),
- Account customisation such as changing email and password,
- Tutorials for if users get stuck, and more

<img src="./resources/demo.gif" alt="NodePad Demo" width="100%" />

<img src="./resources/demo copy.gif" alt="NodePad Demo" width="100%" />
