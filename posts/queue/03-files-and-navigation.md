---
title: terminal 101, chapter 3, the star is not part of ls
slug: terminal-101-03-files-and-navigation
---

# terminal 101, chapter 3, the star is not part of ls

chapter 3 is the longest one, because it is the chapter u actually use every day. move around, make things, copy them, delete them, read them.

## the commands themselves

`cd` to move, `pwd` to see where u are standing, `ls` to see what is here. `mkdir` makes a folder, `touch` makes a file, `cp` copies, `mv` moves, `rm` deletes.

`cat` prints a file, `less` opens it so u can scroll, `head` and `tail` give u the first or last 10 lines.

that is the list. nothing clever in it.

- careful: `rm -rf` never asks u and there is no trash bin. run `pwd` and `ls` first, every time.

## now the actual lesson

the `*` wildcard. `ls *.txt` lists the txt files, `cp *.txt backup/` copies them all.

and here is the thing that confuses everyone including me:

> the `*` is not a feature of `ls` or `cp` or `rm`. it is the shell.

before `ls` even starts, the shell finds the files that match and replaces `*.txt` with their names. so `ls` never sees a star at all.

u do not have to believe me:

```bash
echo *.txt
```

```
notes.txt old.txt
```

`echo` has nothing to do with files. it printed file names because the shell had already swapped the star out before `echo` ran.

once u see that once, u never forget it. and it is also why `rm *` is so dangerous, u are not asking `rm` to be clever, the shell hands it every name in the folder and `rm` obeys.

> put `ls` in front first, read what u are about to hit, then change it to `rm`.

[read chapter 3](https://github.com/Mohamedattiadev/dev-101/tree/main/Terminal-101/03-files-and-navigation)
