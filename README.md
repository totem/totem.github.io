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

## Totem Config
The totem configuration file is typically defined to configure applications deployed in totem. The complete reference can be found [here](config).
