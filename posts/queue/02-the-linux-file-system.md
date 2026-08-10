---
title: terminal 101, chapter 2, there is only one tree
slug: terminal-101-02-the-linux-file-system
---

# terminal 101, chapter 2, there is only one tree

chapter 2 is about the folders u see when u run `ls /` and then panic a little.

## windows habits first

in windows u have `C:` and `D:` and every disk gets its own letter.

linux does not work like that. there is **one** tree, it starts at `/`, and everything is somewhere inside it. ur usb stick, ur second hard disk, all of it. that is the whole idea and everything else in this chapter follows from it.

## u only care about 5 of them

| folder | what is in it |
|---|---|
| `/home/ati` | my files. this is where i work. same as `~` |
| `/etc` | settings, all of them plain text |
| `/var/log` | logs, where u look when something breaks |
| `/tmp` | scratch space, emptied when u restart |
| `/usr/bin` | the commands themselves, as real files |

that last row is worth stopping on:

```bash
which grep
```

```
/usr/bin/grep
```

so `grep` is not magic. it is a small program sitting in a folder on ur disk, exactly like ur notes.md is. every command u learn in this course is a file.

## the rest

u should recognize them so they stop looking scary, and that is all. `/boot` starts the machine, `/lib` is shared code, `/dev` is every device shown as a file, `/proc` is not even on ur disk, the kernel makes it up while u read it.

and `/root` is not `/`. that one catches everyone once, including me.

> `/` is the top of the whole tree. `/root` is just one user's home folder.

[read chapter 2](https://github.com/Mohamedattiadev/dev-101/tree/main/Terminal-101/02-the-linux-file-system)
