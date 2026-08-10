---
title: terminal 101, chapter 1, echo and the two kinds of quotes
slug: terminal-101-01-command-line-basics
---

# terminal 101, chapter 1, echo and the two kinds of quotes

chapter 1 of the course is the smallest one, and it is where everyone starts.

## the first command

```bash
echo "Hello World"
```

that is the whole thing. it prints the text back at u.

variables are the same idea as python, `name="ati"`, and `$name` gives it back. no space before or after the `=`. that part is not optional, `name = "ati"` is just wrong.

## the part that bites u later

```bash
echo "hello $name"    # hello ati
echo 'hello $name'    # hello $name
```

look at the second one. nothing got replaced.

double quotes let the `$` work, single quotes do not. it looks like a small detail on day one, and then u meet it again in every single chapter after this one.

same idea with file names. `touch my file.txt` makes 2 files, `my` and `file.txt`, because the terminal thinks u are talking about 2 things. quote it, or just write `my-file.txt` and stop thinking about it.

## the key nobody tells u about

`Tab`. u type 3 letters of a folder name, u press it, the terminal finishes the rest.

and if it does not finish, that means the file is not there or u are standing in the wrong folder. so it is a free spell check too.

> one command, one variable, one key. that is chapter 1.

[read chapter 1](https://github.com/Mohamedattiadev/dev-101/tree/main/Terminal-101/01-command-line-basics)
