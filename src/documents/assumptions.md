# About
This sections captures all major assumptions and considerations that we made for totem.
It is easy to loose track of this information. So we decided to keep track of these changes.

## 09/04/2015
### Meeting (Josh, Jimmy, Sukrit)
- For totem configurator (github), we will use 2 factor auth using github and also provide support for personal access token. This will allow configurator to be easily used for development using personal access token (for testing).
- Since our services our spanning across cluster, we decided to have a central place to lookup. Ideally we want to have another service that can publish that information in future, but for now we will simply hardocde the values manually and publish out later. (TBD:  apiary vs hyperschema)
