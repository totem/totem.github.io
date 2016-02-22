---
title: "Config"
isNavLink: true
---

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
- Per Repository branch/tag: **/totem/config/[env-name]/[repo-owner]/[repository]/[ref]**
  e.g.: /totem/config/production/totem/totem-demo/develop

## Config Merge
During a deploy, all configs (multiple files, multiple locations) are merged into a single config that typically
gets cached in etcd store. The merge is performed using nested merge strategy in which config keys defined at branch/tag level takes highest precendence while the one defined globally takes the lowest precendence. In addition if multiple config providers are defined e.g. (etcd,s3,default), the provider occuring first takes precendence over the one occuring later.

e.g. Given 2 configs:

```yaml
deployer:
  deployer1:
    enabled: true
  deployer2:
    enabled: false
```
```yaml
deployer:
  deployer1:
    enabled: false
  deployer3:
    enabled: true
```

When we merge the 2 configs, the resulting config looks like:
```yaml
deployer:
  deployer1:
    enabled: true
  deployer2:
    enabled: true
  deployer3:
    enabled: true
```

## Encrypted Values
Some sections of totem config can contain encrypted values. It uses asymmetric cryptography using PKCS#1 v1.5. Refer to [cluster-deployer](https://github.com/totem/cluster-deployer) guide to enable encryption for a given cluster.
The cluster deployer uses different profiles for encryption. See [Config Schema - Security Section](#security) for defining a security profile. The name of default profile is 'default'.

If a given config supports encryption, set encrypted property for the config element to true.
e.g.:
```
deployers:
  default:
    templates:
      app:
        args:
          environment:
            AWS_SECRET_ACCESS_KEY:
              value: "*****encrypted value******"
              encrypted: true
```
In this example, the environment variable "AWS_SECRET_ACCESS_KEY" is injected into the application and its value is marked as injected. The value is decrypted at the final stage of deploy when fleet unit file is created.

## Config Schema
Totem config is validated using [json schema](http://json-schema.org/). Currently there are 2 schemas defined for validation:
- [job-config-v1.json](https://github.com/totem/cluster-orchestrator/blob/master/schemas/job-config-v1.json): This schema corresponds to first step in validation phase. This step is applied after all configs are merged to create a single config.
- [job-config-evaluated-v1.json](https://github.com/totem/cluster-orchestrator/blob/master/schemas/job-config-v1-evaluated.json): This schema corresponds to second step in validation phase. This step is applied after dynamic portions of configs are evaluated.

## Config Elements
### variables
#### Variables Overview
Defines the dynamic values that gets substituted in dynamic section of a given config. Basically it acts as variables for jinja substitution. Refer dynamic section for more details.
e.g.:
```yaml
variables:
  public_host: myapp.myhost.com

proxy:
  hosts:
    public:
      hostname:
        value: "{{public_host}}"
```
In this example, the value of hostname is substituted by myapp.myhost.com when config is evaluated.

#### Template variables
The variables values itself can be evaluated dynamically using jinja templates. The variables are evaluated in order defined by their priority (Variables with lower priority are evaluated first).
e.g.:
```yaml
variables:
  private_host: myapp.myhost.com
  public_host:
    value: "{{public_host}}"
    priority: 2
```
In this example the value of variable public_host is evaluated using the value of private_host.

### security
This section defines the security settings to be used globally or per application. By default, a 'default' security profile is defined. e.g.:
```yaml
security:
  profile: myapp
```
In the above example security profile is changed from 'default' to 'myapp'.  Refer [Encrypted Values](README.md#encrypted-values) section to know more about encryption.

### deployers
This section defines one or more deployer definition.  Each deployer definition consists of different settings to be used for deploying given application and url of the deployer. Typically, the urls can be defined in separate totem file (cluster-def.yml), while the applications specific settings can be added in totem.yml file.

### hooks
This section defines one or more hooks that is being enabled for the given application. The hooks may be a CI hook or builder hook.

### notifications
This section defines one or more notifiers (e.g: github, hipchat) to be used for given application to send success/failed notifications.

### environment
This section defines top level environment variables used by application template. The value defined can be
- Raw string 
- Encrypted Values (Refer [Encrypted Values](README.md#encrypted-values) section to know more about encryption.)
- Templated Values

e.g.: 
```yaml
environment:
  env1: "value1"
  env2:
    value: "{{variable2}}"
  env3:
    value: |
      # if ref == 'master'
      ******encrypted value for master ******
      # else
      ******encrypted value for non master ******
      # endif
    encrypted: true
```
### schedule
You can run your deployment at a given schedule.
e.g.: 
```yaml
schedule: '*:0/5'
```
This will schedule your deployment to execute every 5 minutes.

It uses systemd timer syntax for schedule. See: https://www.freedesktop.org/software/systemd/man/systemd.time.html#Calendar%20Event

Here are commonly used schedule examples:

Schedule                |     Description
------------------------|------------------
*:0/15                  | Schedules deployment to run every 5 minutes (0, 15, 30, 45)
*-*-* 11:00:00          | Run 11:00 AM every day (UTC)
Mon *-*-* 00:00:00      | Runs weekly (every monday at midnight UTC)

**Points to know**:
- This feature is currently in beta.
- Timezone can not be specified as part of schedule (even though systemd supports it). All timezones are considered as UTC.
- Specifying scheduler disables proxy support.
- Scheduled jobs are responsible for error handling , email notifications, concurrent runs , locking etc.
- Jobs are typically scheduled on one of the nodes. If for some reason node goes down, fleet will schedule it on another node.
- Typically, you should ony need to run 1 node for scheduled deployment. However, if you do select multiple, the job will get scheduled at multiple nodes at same time. Your job should handle partitioning / concurrent locking when dealing with same.
- For troubleshooting, use totem logs for your application. However, to troubleshoot issues with scheduling itself, you need to access 'systemd' logs. In order to view systemd logs, use https://github.com/totem/totem-logs/blob/master/cli/tail.js with option `-p systemd`


