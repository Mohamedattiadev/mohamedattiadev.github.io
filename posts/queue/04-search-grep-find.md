---
title: terminal 101, chapter 4, grep is the ctrl+f of the terminal
slug: terminal-101-04-search-grep-find
---

# terminal 101, chapter 4, grep is the ctrl+f of the terminal

chapter 4 is short. 2 commands, and they are easy to mix up.

## grep, for text

u already know what `grep` is, u just know it as `ctrl+f`. u are searching for something inside a file.

```bash
grep "Hello" README.md
```

and the first surprise: it prints back **every line** that contains the word, not the word on its own. most people get that wrong the first time.

the flags u will actually use:

- `-i` ignore uppercase and lowercase
- `-v` invert it, show the lines that do **not** match
- `-n` show the line number
- `-r` search every file under here

`-v` sounds useless until the first time u have to read a log file, then it is the one u reach for.

## find, for files

`grep` searches **inside** files. `find` searches **for** files. that is the whole difference.

```bash
find . -name "*.md"
```

first argument is where to look, `-name` is what to look for. `-type f` gives u only files and `-type d` only folders.

## why the quotes are there

```bash
find . -name "*.md"     # right
find . -name *.md       # confusing error
```

and u already know why, because of chapter 3. without the quotes the shell eats the star before `find` ever sees it.

> so the quotes are not decoration. they are u telling the shell to keep its hands off and let `find` do the matching itself.

[read chapter 4](https://github.com/Mohamedattiadev/dev-101/tree/main/Terminal-101/04-search-grep-find)
