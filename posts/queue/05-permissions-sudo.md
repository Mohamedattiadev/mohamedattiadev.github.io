---
title: terminal 101, chapter 5, reading -rw-r--r-- out loud
slug: terminal-101-05-permissions-sudo
---

# terminal 101, chapter 5, reading -rw-r--r-- out loud

chapter 5 is the one where that weirdo string in `ls -l` finally means something.

## sudo first

as a normal user u are not allowed to do everything. `sudo` is u asking the root user to do the thing for u.

```bash
whoami        # ati
sudo whoami   # root
```

- note: the first time it asks for **ur own** password, not the root one. that surprises people.

and be careful with it. with `sudo` u can also break ur machine, and it will let u.

## now the string

```
-rw-r--r--
│└┬┘└┬┘└┬┘
│ │  │  └──── others : r-- (read only)
│ │  └─────── group  : r-- (read only)
│ └────────── owner  : rw- (read + write)
└──────────── type   : - is a file, d is a directory
```

3 levels, and each level gets the same 3 letters in the same order, `rwx`. read, write, execute. a `-` means that one is off.

so read it as a sentence: normal file, i can read and change it, everyone else can only read it.

## changing it

`chmod` does it, and there are 2 ways:

```bash
chmod u=rwx,g=rx,o= notes.md   # set each level exactly
chmod u+x notes.md             # add one permission to one level
```

`u` is the owner, `g` the group, `o` others, `a` all of them.

- careful: `chmod +x` with no level adds the `x` to **all three**, not just to u. if u mean urself, say `u+x`.

## why this chapter exists

```bash
./hello.sh
```

```
bash: ./hello.sh: Permission denied
```

that is not a bug. that is the permission system doing its job, and now u know exactly which letter is missing.

> `chmod u+x hello.sh` and it runs. that one error message is why chapter 5 comes before scripts.

[read chapter 5](https://github.com/Mohamedattiadev/dev-101/tree/main/Terminal-101/05-permissions-sudo)
