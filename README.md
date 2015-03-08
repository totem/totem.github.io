# totem
Repository for totem documentation, issues, guides.

## What is totem ?
Totem is continous delivery pipline tool which is aimed in simplifying delivery of the code to any environment.

## Architecture
### Totem flow
![](http://www.gliffy.com/go/publish/image/7041599/L.png)
* Developer commits file to git and pushes the changes to scm (e.g: github)
* Github triggers webhooks for push events to image builder tool e.g: "Image Factory" and CI tools e.g. Travis, Bamboo.
* Once travis  (or any other ci) build  and image builder build finishes it notifies orchestrator about the status using post build webhooks.
* Orchestrator on receving any hook, loads/caches the configuration for the build (.totem.yml). This file is loaded from Amazon S3 (or etcd).
* Orchestrator on receving all the hooks with status as "success", it invokes deployer api to deploy the built image to CoreOS cluster.
* Deployer creates fleet unit files for the application and submits the job to fleet daemon (running on CoreOS clusteR). On successul deploy, deployer promotes the current deployment by updating the yoda proxy configuration stored in etcd.

### [Application Deployment](deployment.md)
Here is a sample application deployed using Totem in Amazon EC2 infrastructure.
![](http://www.gliffy.com/go/publish/image/7051027/L.png)

## Reporting Bugs / Feature Requests
Issues can be reported at :
[https://github.com/totem/totem/issues](https://github.com/totem/totem/issues)

## Totem Components
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

