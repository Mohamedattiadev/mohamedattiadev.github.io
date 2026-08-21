---
title: terminal 101, chapter 1, echo and the two kinds of quotes
slug: terminal-101-01-command-line-basics
---

# terminal 101, chapter 1, echo and the two kinds of quotes

chapter 1 is the smallest chapter in the course, and it is where i started too.

## echo

```bash
echo "Hello World"
```

that is basically the same as writing "Hello World" in a text editor, it just prints the text back at u. too ez.

## variables

now i want to store a value and use it later, so i use a variable, same idea as python: `name="ati"`, and then `echo $name` gives it back. no space before or after the `=`, `name = "ati"` is wrong, `name="ati"` is right.

## the two kinds of quotes

```bash
echo "hello $name"    # hello ati
echo 'hello $name'    # hello $name
```

look at the second one. nothing got replaced.

double quotes let the `$` work, single quotes do not. it looks like a small detail on day one, it is not, and u will meet it again in almost every chapter after this one, because the same rule decides whether a file name with a space in it stays as one file or turns into two: `touch my file.txt` makes `my` and `file.txt`, 2 files, not 1, because the terminal thinks u are talking about 2 things.

quote it, `touch "my file.txt"`, or just write `my-file.txt` and stop thinking about it.

## Tab

the key nobody tells u about is `Tab`. i type 3 letters of a folder name, i press it, the terminal finishes the rest for me.

and if it does not finish, that means the file is not there, or i am standing in the wrong folder. so it works as a free spell check too.

> one command, one variable, one key. that is chapter 1.

[read chapter 1](https://github.com/Mohamedattiadev/dev-101/tree/main/Terminal-101/01-command-line-basics)
