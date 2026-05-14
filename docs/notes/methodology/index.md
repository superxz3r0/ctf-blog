# Methodology

My personal approach to CTF challenges and pentesting boxes.

## Network / Machine Boxes

### 1. Recon

```bash
# Quick initial scan
nmap -sV -sC -oN initial.txt <IP>

# Full port scan
nmap -p- --min-rate 5000 -oN allports.txt <IP>
```

### 2. Enumeration

Run service-specific enumeration based on open ports:

- **80/443** — gobuster/feroxbuster, nikto, look for CMS
- **21 FTP** — anonymous login, version exploits
- **22 SSH** — version exploits, credential stuffing
- **139/445 SMB** — enum4linux, smbclient, crackmapexec
- **3306 MySQL** — try default creds

### 3. Exploitation

- Search exploit-db / searchsploit
- Check CVEs for discovered versions
- Look for misconfigurations

### 4. Post-Exploitation

```bash
# Linux privesc enumeration
./linpeas.sh
sudo -l
find / -perm -4000 2>/dev/null  # SUID binaries
crontab -l && cat /etc/crontab
```

### 5. Flags

- User flag: `/home/<user>/user.txt`
- Root flag: `/root/root.txt`

## Web Challenges

1. Read the source
2. Check cookies and headers
3. Fuzz parameters
4. Look for IDOR, SQLi, XSS, SSTI, LFI/RFI
5. Check robots.txt, sitemap, `.git/`, `.env`
