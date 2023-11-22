# Teachable Progress
CLI for generating enrollment progress csv's for teachable.

## Installation
1. Clone repository to your computer.
2. Have [`node`](https://nodejs.org/en) installed.
3. `cd` into the github repo
4. Run `npm install & npm -g install .`

## Usage
To use the CLI, make sure that you have the [environment variable](https://www3.ntu.edu.sg/home/ehchua/programming/howto/Environment_Variables.html) `TEACHABLE_API_KEY` set. Then run the command `teachprog`.

```
teachprog <command>

Usage:

teachprog list-courses         list all courses
teachprog generate <courseId>  generates csv of all student enrolled in course
```
