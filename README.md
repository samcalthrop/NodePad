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

```
writeup/
    ├── 1 - Analysis/
        ├── 1.1-problem_description.md
        ├── 1.2-stakeholders.md
        ├── 1.3-computational_methods.md
        ├── 1.4-research.md
        ├── 1.5-proposed_solution_features.md
        ├── 1.6-computational_requirements.md
        └── 1.7-success_criteria.md
    ├── 2 - Iterative Development/
        ├── 2.1-Iteration1/
            ├── 2.1.1-aims.md
            ├── 2.1.2-functionality_of_prototype.md
            ├── 2.1.3-annotation_of_code.md
            ├── 2.1.4-stakeholder_feedback.md
            └── 2.1.5-evaluation.md
        ├── 2.2-Iteration2/
            ├── 2.2.1-aims.md
            ├── 2.2.2-functionality_of_prototype.md
            ├── 2.2.3-annotation_of_code.md
            ├── 2.2.4-stakeholder_feedback.md
            └── 2.2.5-evaluation.md
        └── 2.3-Iteration3/
            ├── 2.3.1-aims.md
            ├── 2.3.2-functionality_of_prototype.md
            ├── 2.3.3-annotation_of_code.md
            ├── 2.3.4-stakeholder_feedback.md
            └── 2.3.5-evaluation.md
    ├── 3 - Design/
        ├── 3.1 - Design Part I/
            ├── 3.1.1-decomposition.md
            ├── 3.1.2-systems_processes.md
            ├── 3.1.3-interface_designs.md
            └── 3.1.4-user_flow.md
        └── 3.2 - Design Part II/
            ├── 3.2.1-algorithms.md
            ├── 3.2.2-data_structures.md
            └── 3.2.3-post_development_test_data.md
    └── 4 - Evaluation/
        ├── 4.1-post_development_testing.md
        ├── 4.2-evaluation.md
        ├── 4.3-maintenence_and_future_improvements.md
        └── 4.4-final_reflection.md
```

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
