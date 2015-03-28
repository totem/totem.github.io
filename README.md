# What is totem ?
Totem is continous delivery pipline tool which is aimed in simplifying delivery of the code for stateless application to any environment. Under the hood, it utilizes containerization tools and technology ([Docker](https://www.docker.com)).

It was specifically designed for micro services/frameworks by utilizing practices and patterns that are used for deploying the same ([gitflow](http://jeffkreeftmeijer.com/2010/why-arent-you-using-git-flow/), service discovery, containerization, centralized logging, and more...)

# Reporting Issues
Issues can be reported at :
[https://github.com/totem/totem.github.io/issues](https://github.com/totem/totem.github.io/issues)
Issues may include help requests, bugs or feature requests. 

# Architecture
## High Level flow
![](http://www.gliffy.com/go/publish/image/7041599/L.png)
* Developer commits file to git and pushes the changes to scm (e.g: [github](https://github.com/))
* Github triggers webhooks for push events to image builder tool e.g: ["Image Factory"](https://github.com/totem/docker-image-factory) and CI tools like [Travis](https://travis-ci.org), [Bamboo](https://www.atlassian.com/software/bamboo).
* Once travis  (or any other ci) build  and image builder build finishes it notifies [orchestrator](https://github.com/totem/cluster-orchestrator) about the status using post build webhooks.
* Orchestrator on receving any hook, loads/caches the configuration for the build (totem.yml). This file is loaded from [Amazon S3](http://aws.amazon.com/s3/) (or [etcd](https://coreos.com/using-coreos/etcd/)).
* Orchestrator on receving all the hooks with status as "success", it invokes deployer api to deploy the built image to [CoreOS cluster](https://coreos.com/).
* Deployer creates [fleet](https://coreos.com/using-coreos/clustering) unit files for the application and submits the job to fleet daemon (running on CoreOS cluster). On successul deploy, deployer promotes the current deployment by updating the yoda proxy configuration stored in etcd.

## [Application Deployment](deployment.md)
Here is a sample application deployed using Totem in Amazon EC2 infrastructure.
![](http://www.gliffy.com/go/publish/image/7051027/L.png)

## Components
The "Totem Ecosystem" comprises of several components each responsible to perform discrete set of jobs. One may choose to deploy some/all of the components in Totem , depending upon his/her needs. It is also possible to have
additional components for deploying applications using Totem (for e.g.: sidekicks for registering with SkyDNS)

* [**Image Factory**](https://github.com/totem/docker-image-factory): Responsible for building docker images using "Dockerfile" and push these to a central registry
  (e.g: Quay)
* [**Orchestrator**](https://github.com/totem/cluster-orchestrator): Responsible for consuming hooks from different services (like Travis, Image Factory etc) and creating deployment requests to *Deployers* for configured clusters.
* [**Deployer**](https://github.com/totem/cluster-deployer): Schedules the deployment to a cluster (currently CoreOS) and sets up the proxy hosts/listeners.
* [**Yoda Proxy**](https://github.com/totem/yoda-proxy): Dynamic Haproxy backed by etcd.
* [**Yoda Discover**](https://github.com/totem/yoda-discover): Acts as side kick for registering application unit to yoda proxy using etcd as backing store.
  Also provides ability to register yoda hosts to etcd.
* [**Yoda Route53**](https://github.com/totem/yoda-discover): Registers the yoda hosts with Amazon Route 53 for DNS based load balancing for hosts.
* [**Fleet Templates**](https://github.com/totem/fleet-templates): Jinja based fleet unit files that gets deployed to CoreOS cluster. Some of the default templates are already provided, but one may choose to have his/her own custom templates.

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
gets cached in etcd store. The merge is performed using nested merge strategy with config keys defined at branch
or tag level takes the highest precendence while the one defined globally takes the lowest precendence. In addition
if multiple config providers are defined e.g. (etcd,s3,default), the provider occuring first takes precendence over
the one occuring later.

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
The cluster deployer uses different profiles for encryption. See [Config Schema - Security Section](README.md#security) for defining a security profile. The name of default profile is 'default'.

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

#### Templated variables
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
In the above example security profile is changed from 'default' to 'myapp'.  Refer [Encrypted Values](README.md#encrypted-values) section to kno more about encryption.

### deployers
This section defines one or more deployer definition.  Each deployer definition consists of different settings to be used for deploying given application and url of the deployer. Typically, the urls can be defined in separate totem file (cluster-def.yml), while the applications specific settings can be added in totem.yml file.

### hooks
This section defines one or more hooks that is being enabled for the given application. The hooks may be a CI hook or builder hook.

### notifications
This section define one or more notifiers (e.g: github, hipchat) to be used for given application to send success/failed notifications.
