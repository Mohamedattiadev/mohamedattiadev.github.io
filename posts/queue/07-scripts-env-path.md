---
title: terminal 101, chapter 7, why u have to write ./hello.sh
slug: terminal-101-07-scripts-env-path
---

# terminal 101, chapter 7, why u have to write ./hello.sh

chapter 7 is `export`, the `.bashrc` file, aliases, and the `PATH`. it is also where a question from chapter 5 finally gets answered.

## compiled and interpreted, in one line each

- compiled = translating a whole book once, then handing over the translated book.
- interpreted = translating sentence by sentence out loud, every time someone reads it.

`gcc hello.c -o hello` gives u a new file on the disk that u run by itself. `python3 hello.py` gives u nothing on the disk, only the result. bash is the second kind.

## the shebang

```bash
#!/bin/bash
echo "Hello World"
```

the first line tells the terminal which interpreter to use, so u can run it as `./hello.sh` instead of `bash hello.sh`.

- careful: it has to be the **first** line. one empty line above it and it stops working.

## export and .bashrc

`var="value"` is local and dies with that terminal. `export VAR="value"` sends it to the environment so other scripts can see it.

both of them die when u close the terminal. `.bashrc` is the file that runs every time u open a new one, so anything u want to keep goes in there. same for aliases:

```bash
alias ..="cd .."
alias ...="cd ../.."
```

- note: after u change `.bashrc`, run `source ~/.bashrc` or the change only shows up in the next terminal u open.

## and the answer

```bash
echo $PATH
```

```
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/home/ati/.local/bin
```

a list of folders, separated by `:`, searched left to right. that is why u type `ls` and not `/usr/bin/ls`.

and the current folder is **not** in that list. that is the whole reason u write `./hello.sh`, the `./` is u saying "look right here".

- careful: when u add to it, never drop the `$PATH:` part. `export PATH=/home/ati/my-programs` throws away every other folder and almost nothing works in that terminal anymore.

> so `./` was never a rule to memorise. it is a list, and the current folder is not on it.

[read chapter 7](https://github.com/Mohamedattiadev/dev-101/tree/main/Terminal-101/07-scripts-env-path)
