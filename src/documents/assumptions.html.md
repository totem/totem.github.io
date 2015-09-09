---
title: "Assumptions"
isNavLink: true
---

# About
This sections captures all major assumptions and considerations that we made for totem.
It is easy to loose track of this information. So we decided to keep track of these changes.

## 09/04/2015
### Meeting (Josh, Jimmy, Sukrit)
- For totem configurator (github), we will use 2 factor auth using github and also provide support for personal access token. This will allow configurator to be easily used for development using personal access token (for testing).
- Since our services our spanning across cluster, we decided to have a central place to lookup. Ideally we want to have another service that can publish that information in future, but for now we will simply hardocde the values manually and publish out later. (TBD:  apiary vs hyperschema)

## 09/07/2015
### Format Selection for Schemas - Apiary, HyperSchema  (Sukrit)
- Based on following reasons, I decided to go ahead with hyperschema
  - I have already used hyperschema for all other projects. (It has some pain points , but do not feel it is worth an effort that it needs to be replaced.)
  - Apiary seems to do a decent job for translating human readable format to json. However, when dealing with only machines, it is too deep and too verbose where as hyperschema seems relatively less verbose.
  - Could not find a way to translate json document to human readable document. In our current use case, we are only dealing with machines publishing information, so we will we working with json format. The human reable format should be the output so that we do not have to write documentation.
