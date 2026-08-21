---
title: terminal 101, chapter 2, there is only one tree
slug: terminal-101-02-the-linux-file-system
---

# terminal 101, chapter 2, there is only one tree

chapter 2 is about the folders i see the moment i run `ls /` and panic a little. i still remember doing that.

## one tree, not a `C:` and a `D:`

in windows every disk gets its own letter, `C:`, `D:`, and so on.

linux does not work like that. there is **one** tree, it starts at `/`, and everything is somewhere inside it, ur usb stick, ur second hard disk, all of it. that is the whole idea, and everything else in this chapter just follows from it.

## the 5 i actually care about

| folder | what is in it |
|---|---|
| `/home/ati` | my files. this is where i work. same as `~` |
| `/etc` | settings, all of them plain text |
| `/var/log` | logs, where i look when something breaks |
| `/tmp` | scratch space, emptied when i restart |
| `/usr/bin` | the commands themselves, as real files |

that last row is worth stopping on. i run `which grep`, i get `/usr/bin/grep` back.

so `grep` is not magic, it is a small program sitting in a folder on my disk, exactly like my notes.md is, and every command i learn in this course turns out to be a file too, sitting somewhere, waiting to be read like any other file.

## the rest

i just need to recognize the rest so they stop looking scary, nothing more than that. `/boot` starts the machine. `/lib` is shared code. `/dev` is every device shown as a file. `/proc` is not even on my disk, the kernel makes it up while i am reading it.

and `/root` is not `/`. that one catches everyone once, it caught me too.

> `/` is the top of the whole tree. `/root` is just one user's home folder.

[read chapter 2](https://github.com/Mohamedattiadev/dev-101/tree/main/Terminal-101/02-the-linux-file-system)
