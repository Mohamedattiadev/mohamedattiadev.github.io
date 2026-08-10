---
title: terminal 101, chapter 8, the pipe is the best idea in the terminal
slug: terminal-101-08-io-pipes-processes
---

# terminal 101, chapter 8, the pipe is the best idea in the terminal

chapter 8 is the big one. exit codes, redirecting, the pipe, background jobs, killing things.

## exit codes

`0` means it worked, anything else means it did not. `$?` holds the code of the last command.

```bash
ls ~
echo $?     # 0
```

it looks pointless right now. it is the thing `&&` is checking, so hold on to it.

## sending output somewhere

`>` writes to a file, `>>` adds to the end of it.

- careful: this is the difference that costs people their files. `>` erases first and writes from zero, `>>` keeps what was there.

and errors are a separate channel, so `2>` catches those. which means:

```bash
echo "hi" 2> out.txt
```

`hi` still goes to ur screen and `out.txt` is empty, because `echo` succeeded and never used the error channel at all.

## the pipe

```bash
ls | grep ".txt" | wc -l
```

```
3
```

the output of each one becomes the input of the next. `ls` lists, `grep` keeps the txt ones, `wc -l` counts the lines.

> this is the single most useful idea in the whole terminal. small commands that each do one thing, and u chain them.

## ; and && are not the same

```bash
mkdir practice ; cd practice     # cd runs even if mkdir failed
mkdir practice && cd practice    # cd only runs if mkdir worked
```

and `&&` is literally checking the exit code from the top of this post. that is why u see it everywhere in install instructions, it is not decoration.

## the 3 that get mixed up

- `ctrl + c` kills it
- `ctrl + z` **pauses** it
- `&` runs it without blocking u

`ctrl + z` is the one that catches people. it does not keep the program running, it freezes it. `bg` is what actually starts it moving again.

> and if something is stuck for real, `ps aux | grep name` gives u the PID and `kill PID` ends it. that pipe again, doing real work.

[read chapter 8](https://github.com/Mohamedattiadev/dev-101/tree/main/Terminal-101/08-io-pipes-processes)
