# totem.github.io [![Build Status](https://travis-ci.org/totem/totem.github.io.svg?branch=develop)](https://travis-ci.org/totem/totem.github.io)
In order to look at published version for totem documentation , please visit
[totem.github.io](http://totem.github.io)

## Issue Tracker
All issues related to totem components and documentation can be tracked at: [https://github.com/totem/totem.github.io/issues](https://github.com/totem/totem.github.io/issues)

## Contributing to totem documentation
In order to contribute towards improving totem documentation , please fork this repository and submit pull request to develop branch. (Note: master branch is being used for hosting published version of github pages)

### Pre-Requisites
- node v0.10.30+

### Installing Dependencies
```
npm install
```

### Running Documentation Server (Locally)
```
npm start
```
This will start docpad server at: [http://localhost:9778](http://localhost:9778)

### Publishing to totem.github.io (Admins Only)
Totem admins can publish the develop branch to [totem.github.io](http://totem.github.io) using:
```
node_modules/docpad/bin/docpad deploy-ghpages --env static
```
