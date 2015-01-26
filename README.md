# totem
Repository for totem documentation, issues, guides.

## What is totem ?
Totem is continous delivery pipline tool which is aimed in simplifying delivery of the code to any environment.

## Architecture
### Totem flow
![](http://www.gliffy.com/go/publish/image/7041599/L.png)
* Developer commits file to git and pushes the changes to scm (e.g: github)
* Github triggers webhooks for push events to image builder tool e.g: "Image Factory" and CI tools e.g. Travis, Bamboo.
* Oncetravis  (or any other ci) build  and image builder build finishes it notifies orchestrator about the status using post build webhooks.
* Orchestrator on receving any hook, loads/caches the configuration for the build (.totem.yml). This file is loaded from Amazon S3 (or etcd).
* Orchestrator on receving all the hooks with status as "success", it invokes deployer api to deploy the built image to CoreOS cluster.
* Deployer creates fleet unit files for the application and submits the job to fleet daemon (running on CoreOS clusteR). On successul deploy, deployer promotes the current deployment by updating the yoda proxy configuration stored in etcd.

### [Application Deployment](deployment.md)

## Reporting Bugs / Feature Requests
Issues can be reported at :
[https://github.com/totem/totem/issues](https://github.com/totem/totem/issues)

