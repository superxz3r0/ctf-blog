---
tags:
  - tryhackme
  - easy
  - linux
  - web
---

# Room Name

!!! info "Room Info"
    - **Platform:** TryHackMe
    - **Difficulty:** Easy
    - **Category:** Linux / Web
    - **URL:** [Room Link](https://tryhackme.com/room/ROOMNAME)

## Summary

Brief description of what this room covers and the key techniques used.

## Recon

```bash
nmap -sV -sC -oN nmap.txt <IP>
```

```
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 7.6p1
80/tcp open  http    Apache httpd 2.4.29
```

## Enumeration

### Web

```bash
gobuster dir -u http://<IP> -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
```

!!! note "Finding"
    Found `/admin` directory returning 200.

## Exploitation

Describe what vulnerability you found and how you exploited it.

```bash
# example exploit command
```

!!! success "Shell obtained"
    Got a reverse shell as `www-data`.

## Privilege Escalation

```bash
sudo -l
```

```
User www-data may run the following commands:
    (ALL) NOPASSWD: /usr/bin/vim
```

Exploited via [GTFOBins](https://gtfobins.github.io/):

```bash
sudo vim -c ':!/bin/bash'
```

## Flags

| Flag | Value |
|------|-------|
| User | `THM{...}` |
| Root | `THM{...}` |

## Key Takeaways

- What did you learn?
- What would you do differently?
- Any new tools or techniques discovered?
