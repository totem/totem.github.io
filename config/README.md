# Totem Config Guide
## About
This guide covers the basics of totem configuration file used per deployed application in totem.

## Supported Formats
Currently [YAML](http://yaml.org/) is the only supported configuration format used in totem.

## Config Names
The totem configuration file names can be be configured during orchestrator provisioning. By default following names
are used:
- **cluster-def.yml** : Typically used at global level to define cluster definition.
- **totem.yml**: Typically used at global/application level for defining rest of config.  
*Note: You may break the config into multiple files if needed. In the end , all configs are merged into a single file
during deployment*

## Config Location
The config can be stored in one or more locations defined by env. variable **CONFIG_PROVIDER_LIST** in orchestrator.
*Note: If using AWS, typical approach is to store config in Amazon S3. CONFIG_PROVIDER_LIST=s3*
All except (default and github) provider support multi level config where in the config file can be defined:
- Globally (for all environments ) at path: **/totem/config**
- Per environment at path: **/totem/config/[env-name]**  e.g.:  /totem/config/production
- Per Repository owner at path: **/totem/config/[env-name]/[repo-owner]** e.g.: /totem/config/production/totem
- Per Repository at path: **/totem/config/[env-name]/[repo-owner]/[repository]**
  e.g.: /totem/config/production/totem/totem-demo
- Per Repository branch or tag: **/totem/config/[env-name]/[repo-owner]/[repository]/[ref]**
  e.g.: /totem/config/production/totem/totem-demo/develop
  
## Config Merge
During a deploy, all configs (multiple files, multiple locations) are merged into a single config that typically
gets cached in etcd store. The merge is performed using nested merge strategy. with config keys defined at branch
or tag level takes the highest precendence while the one defined globally takes the lowest precendence. In addition
if multiple config providers are defined e.g. (etcd,s3,default), the provider occuring first takes precendence over
the one occuring later.

