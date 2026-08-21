---
title: terminal 101, chapter 3, the star is not part of ls
slug: terminal-101-03-files-and-navigation
---

# terminal 101, chapter 3, the star is not part of ls

chapter 3 is the longest one, because it is the chapter i actually use every day. move around, make things, copy them, delete them, read them.

## moving around and touching files

`cd` moves me, `pwd` tells me where i am standing, `ls` shows me what is here. `mkdir` makes a folder, `touch` makes a file, `cp` copies, `mv` moves, `rm` deletes.

`cat` prints a file, `less` opens it so i can scroll, `head` and `tail` give me the first or last 10 lines. that is the whole list, nothing clever in it.

careful: `rm -rf` never asks u and there is no trash bin, so i run `pwd` and `ls` first, every time, before i touch it.

## the wildcard

now the actual lesson of the chapter, the `*` wildcard. `ls *.txt` lists the txt files, `cp *.txt backup/` copies all of them in one line instead of typing 20 names.

and here is the part that confuses everyone, including me:

> the `*` is not a feature of `ls` or `cp` or `rm`. it is the shell.

before `ls` even starts, the shell finds the files that match and swaps `*.txt` for their names, so `ls` never sees a star at all, it just gets a list of names as if i typed them by hand.

i did not believe it either, until i tried this:

```bash
echo *.txt
```

```
notes.txt old.txt
```

`echo` has nothing to do with files. it printed file names because the shell had already replaced the star before `echo` even ran.

once u see that, u never forget it. and it is also why `rm *` is so dangerous, i am not asking `rm` to be clever, the shell hands it every name in the folder and `rm` obeys, all of them, no questions asked.

> `ls` first, always. read what u are about to hit, then change it to `rm`.

[read chapter 3](https://github.com/Mohamedattiadev/dev-101/tree/main/Terminal-101/03-files-and-navigation)
