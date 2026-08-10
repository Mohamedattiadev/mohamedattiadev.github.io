---
title: terminal 101, chapter 6, one idea makes vim make sense
slug: terminal-101-06-text-editors
---

# terminal 101, chapter 6, one idea makes vim make sense

chapter 6 is `nano` and `vim`. one of them takes 5 minutes to learn and the other one takes one idea.

## nano is the 5 minutes

u open it, u type, the letters appear. no modes, no trick.

and look at the bottom of the screen, the shortcuts are printed right there while u work. `^` means `ctrl`, so `^X` is exit and `^O` is save.

that is really all of `nano`. u know it now.

## vim is the one idea

everyone opens vim, types some letters, weird things happen, and then they can not even close it.

so before any command:

> in vim, ur keyboard does 2 different jobs, and u switch between them.

in a normal editor the letter keys always type letters, so anything else needs `ctrl` or the mouse. vim made a different choice. most of the time u are not typing, u are moving and changing things, so vim gives the letter keys to those jobs. typing is the thing u switch into with `i`, and `Esc` brings u back.

- if u are ever lost, press `Esc`. press it twice, it costs nothing.

## getting out, since that is the real question

```
:q      quit, only if u changed nothing
:wq     write and quit, the normal one
:q!     quit and throw away everything
```

## and why people bother

commands take a number and a target, and u combine them freely.

```
dd     delete a line
3dd    delete 3 lines
dw     delete a word
yy     copy a line
3yy    copy 3 lines
```

so u are not memorising a list. u learn `d` is delete, u learn `w` is word, and `dw` is free.

> use `nano` for real work in ur first week, and practise vim on a copy of a file. learning vim while u are in a hurry is how people end up hating it.

[read chapter 6](https://github.com/Mohamedattiadev/dev-101/tree/main/Terminal-101/06-text-editors)
