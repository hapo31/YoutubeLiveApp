# YTLH - YouTube Live Helper ver 0.22

[**Japanese**](README.md)

## Description

A tool that make YouTube Live easier.

### Features

- Jump to previously visited location
- Copy Live Chat URL directly to clipboard
- Make a history list of Super Chat
- Mark Super Chat as read

Coming soon:

- Display Live Chat URL
- Call external screen reader ([BouyomiChan](https://chi.usamimi.info/Program/Application/BouyomiChan/), etc.)
- Notify Live schedule
- Apply plug-in application

## Installation

1. Download zip from [Releases page](https://github.com/happou31/YouTubeLiveApp/releases)
2. Extract to anywhere

## Usage

1. Sign in to YouTube
If you use Two-Factor Authentication, choose Google Authenticator. 
2. Open Dashboard, you can control normally
3. *You can open Super Chat window from "Tools" menu.*
  - **This feature isn't enough tested. Because my own channel is not monetized...** (Although it is possible to send pseudo data.)
  - My channel is [here](https://www.youtube.com/channel/UCn9PQpGGbbcoq82TLnXYK5Q). Do what you think is best.

##### *Documentation is currently under construction...*
You can watch [explainer video](https://youtu.be/g88_v_hfOcQ).

## Uninstallation

1. Delete entire folder
2. Press Win+R,  enter %appdata%
3. Delete "youtube_live" folder
4. (Please tell anything you notice)

## for Developers

### GitHub
https://github.com/happou31/YouTubeLiveApp/

### Requirement

- Node.js >= 12.13.1
- yarn (recommended)

## Development environment

1. Install require packages

```
$ yarn
```

2. Build development version

```bash
$ yarn dev
```

3. Start debugging

```
$ yarn start
```

## Build

### for Windows x86 or x86_64
```powershell
> yarn build:win
```

### for Others

_Work in progress_

Maybe will implement soon...
Or You can pull request me 😀
