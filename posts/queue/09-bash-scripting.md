---
title: terminal 101, chapter 9, a script is just the commands u already type
slug: terminal-101-09-bash-scripting
---

# terminal 101, chapter 9, a script is just the commands u already type

last chapter, and it is the one where the other 8 pay off. there is nothing new to learn about the commands themselves, u are only putting them in a file.

## arguments

whatever u type after the script name arrives inside it as `$1`, `$2` and so on.

```bash
#!/bin/bash
echo "hello $1, u are $2 years old"
```

```bash
./greet.sh ati 23
```

```
hello ati, u are 23 years old
```

- careful: always write `"$1"` with the double quotes. a file name with a space in it breaks the bare version, exactly the way it did back in chapter 1.

## if, and the space that catches everyone

```bash
if [ -f "notes.txt" ]; then
    echo "the file is there"
fi
```

`if` ... `then` ... `else` ... `fi`. and yes, `fi` is `if` backwards, that is really the reason.

now the mistake everyone makes. `["$1"="hello"]` gives u an error that makes no sense, because the spaces inside `[ ]` are not optional.

and here is why:

```bash
which [
```

```
/usr/bin/[
```

`[` is not punctuation. it is a real command, sitting in `/usr/bin` like every other one from chapter 2. so `[ "$1" = "hello" ]` is that command being handed 4 arguments, and commands need spaces between their arguments.

> once u see that, the spacing rule stops being something to memorise.

## loops, and the safest habit in the course

```bash
for file in *.txt; do
    mv "$file" "${file%.txt}.md"
done
```

`${file%.txt}` cuts `.txt` off the end, then we add `.md` ourselves. the `%` is the "cut from the end" part.

- careful: run that once and ur txt files are gone, they are md now.

so put `echo` in front of the `mv`, run it, and read what it **would** have done. nothing gets renamed, u only printed the commands. then take the `echo` out.

## when to stop

bash is very good at running programs and moving files around, and it gets ugly fast at real logic or maths.

> if ur script passes 100 lines, that is bash telling u to write it in python instead.

that is the end of terminal 101. 9 chapters, and every one of them is a real thing u will use this week.

[read chapter 9](https://github.com/Mohamedattiadev/dev-101/tree/main/Terminal-101/09-bash-scripting)
