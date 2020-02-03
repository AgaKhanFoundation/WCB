# Deploys
This document describes how to upgrade the dev instance of this application in a Kubernetes cluster using the chart in this repository located under the `charts/` directory.

# Pre-requisites
- Access to Kubernetes cluster
- [Helm](https://github.com/helm/helm) version 2.15.2 installed on machine
- This repo cloned on your local machine

## Create a Git tag
```console
$ git push origin master
$ git tag -l             # ensure your tag is not already created
$ git tag 0.x.0          # generally increment x by 1
```

## Build and Push Docker Image

1. Build a docker image for the application using docker utility on command line: `$ docker build -t <dockeruser>/wcb:<version> .`

For example:
```console
$ docker build -t michelle/wcb:0.16.0 .
```

2. Push docker image to registry: `$ docker push <dockeruser>/wcb:<version>`

For example:
```console
$ docker push michelle/wcb:0.16.0
```

## Use Helm to Upgrade

1. In `charts/wcb-dev/values.yaml`, change the lines `26` and `30` to be <subdomain>.<domain>.org.

2. Then, run the `helm ugprade` command:
```console
$ helm upgrade dev charts/wcb-dev/ --set image.tag=<version> --set env.serverPassword=<server-password>
```
4. Run `helm status` to ensure all Kubernetes resources deployed successfully.
```console
$ helm status dev
```
5. Check the dev pod status and logs to ensure no errors or to debug any errors
```console
$ kubectl get pods
$ kubectl describe pod <pod-name>
$ kubectl logs <pod-name>
```

## Use Helm to Rollback in case of errors
```console
$ helm ls dev
$ helm rollback dev <REVISION-1> # subtract 1 from the current revision number
```
