---
title: Deploy an Application Using Kubernetes and Docker Containers
---

## Problem Statement

When building software applications, it's common to break them down into smaller parts called microservices. These microservices can be developed and managed independently, allowing for more flexibility and scalability.

However, managing a large number of microservices can quickly become complex and challenging. This is where Kubernetes and Docker come in.

Docker is a tool that allows developers to package their applications and dependencies into containers, which can then be run on any system that supports Docker. This makes it easier to deploy and manage applications across different environments.

Kubernetes, on the other hand, is a container orchestration platform that automates the deployment, scaling, and management of containerized applications. It helps to simplify the management of multiple containers, allowing developers to focus on building their applications rather than worrying about infrastructure.

Together, Docker and Kubernetes provide a powerful solution for managing microservices. With Docker, developers can package their applications into containers, which can then be easily deployed and managed with Kubernetes. This allows for faster development and deployment of applications, improved scalability, and more efficient use of resources.

Doing this exercise will help developers understand, and able to perform their own deployments using the tools as well. By performing the deployment themselves, developers can gain a deeper understanding of the containerization process and how to create Docker images that are optimized for deployment on Kubernetes. They can also gain experience with the Kubernetes deployment manifest and service definitions, which can help them troubleshoot issues and make changes to the deployment as needed. In addition to the technical benefits, performing this exercise can also promote greater understanding and collaboration between the DevOps and development teams. By working together on the deployment process, developers and DevOps can share knowledge, exchange ideas, and identify areas for improvement.

## Overview

In this exercise, we will deploy a JavaScript backend application on Kubernetes using Docker containers. Kubernetes is an open-source container orchestration tool that helps manage and automate containerized applications. Docker is a containerization platform that allows developers to package applications and their dependencies into a single container.

## Implementation Details:

To deploy a JavaScript backend application on Kubernetes using Docker containers, follow these steps:

#### Step 1: Containerize the application using Docker.

1. Write a Dockerfile that specifies the application's dependencies and how to run the application.
2. Build the Docker image using the Dockerfile.
3. Push the Docker image to a container registry.
4. Build an image from Alpine linux image which is light weight but has all necessities installed.

Dockerfile Example:

```
FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
```

Building and pushing commands.

```
docker build -t your-registry/your-image-name:your-tag .
docker push your-registry/your-image-name:your-tag
```

#### Step 2: Prepare a mutli-stage build file of docker.

The addition of a command in a Dockerfile contributes a new layer to the image, which results in an increase in size. As a result, it is not optimal to have separate containers for development and production environments. Multistage builds offer a solution to this problem by allowing the use of multiple FROM statements in the Dockerfile. Each FROM statement can use a different base and initiate a new build stage. In doing so, artifacts can be selectively copied from one stage to another, while leaving out any unwanted elements in the final image.

You can read more about the this from here: <a href="https://docs.docker.com/build/building/multi-stage/">Multi-stage builds</a>

#### Step 3: Create a Kubernetes deployment manifest.

1. Define the deployment configuration in a YAML file.
2. Set the number of replicas for the deployment.
3. Set the container image to use for the deployment.
4. Set the container port to expose for the deployment.

Deployment Manifest Example:

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: your-deployment-name
spec:
  replicas: 3
  selector:
    matchLabels:
      app: your-app-label
  template:
    metadata:
      labels:
        app: your-app-label
    spec:
      containers:
      - name: your-container-name
        image: your-registry/your-image-name:your-tag
        ports:
        - containerPort: 3000
```

The "kind" field is used to differentiate between different Kubernetes resources, such as Pods, Services, Deployments, ConfigMaps, and more. By specifying the "kind" field in your YAML file, you are telling Kubernetes what type of object you want to create or modify, and Kubernetes will then use the appropriate API to perform the requested action.

Application of deployment manifest.

```
kubectl apply -f your-deployment-manifest.yaml
```

#### Step 4: Deploy the application to Kubernetes.

1. Use the kubectl command-line tool to deploy the application.
2. Apply the deployment manifest using the kubectl apply command.
3. Check the status of the deployment using the kubectl get command.

#### Step 5: Expose the application using a Kubernetes service.

1. Define the service configuration in a YAML file.
2. Set the service type to LoadBalancer or NodePort to expose the application.
3. Set the target port and port for the service.
4. Apply the service manifest using the kubectl apply command.

Updated Service Manifest

```
apiVersion: v1
kind: Service
metadata:
  name: your-service-name
spec:
  type: LoadBalancer
  selector:
    app: your-app-label
  ports:
    - name: http
      port: 80
      targetPort: 3000
```

#### Step 6: Test the application.

1. Get the IP address and port of the service using the kubectl get service command.

2. Set Up Testing Environment
   To test our application, we will need to set up a testing environment that mirrors our production environment. This environment should include all the necessary resources, such as pods, services, and volumes, needed for our application to function correctly. You can use a Kubernetes YAML file to define your testing environment and deploy it using kubectl. Here's an example YAML file:

```
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
    - name: my-app
      image: my-app-image:latest
      ports:
        - containerPort: 8080
```

3. Deploy Application to Testing Environment.

4. Access the REST API using tools such as Postman.

5. Check the Logs

After testing your application, it's a good idea to check the logs to ensure that everything is running as expected. To do this, you can use the following command:

```
kubectl logs <pod-name>
```

This command will show you the logs for a specific pod, allowing you to identify any issues or errors that may have occurred.

6. Scale Your Application

Finally, if you need to scale your application, you can use the following command to increase or decrease the number of replicas:

```
kubectl scale deployment/<deployment-name> --replicas=<number-of-replicas>
```

This command will scale your deployment to the specified number of replicas, allowing you to increase or decrease the resources allocated to your application.

## Considerations:

When deploying a JavaScript backend application on Kubernetes using Docker containers, consider the following:

1. Use a container registry to store and distribute Docker images.
2. Use a container image scanning tool to identify vulnerabilities in the Docker image.
3. Use Kubernetes ConfigMaps and Secrets to manage configuration data and sensitive information.
4. Use Kubernetes horizontal pod autoscaling to scale the application based on demand.
5. Use Kubernetes rolling updates to deploy new versions of the application without downtime.

## Future Improvements:

1. Some improvements that can be made to the deployment process include:
2. Use a continuous integration and continuous deployment (CI/CD) pipeline to automate the deployment process.
3. Use Kubernetes Operators to automate application management tasks.
4. Use Kubernetes service mesh tools such as Istio or Linkerd to manage traffic between microservices.
5. Use Kubernetes StatefulSets to manage stateful applications such as databases.

## Resources:

1. <a href="https://www.docker.com/resources/what-container">Docker Overview</a>
2. <a href="https://kubernetes.io/docs/setup/learning-environment/minikube/">Getting Started with Kubernetes</a>
3. <a href="https://www.middlewareinventory.com/blog/deploy-docker-image-to-kubernetes/">How to Deploy docker image to Kubernetes</a>
4. <a href="https://containerjournal.com/features/deploying-node-js-apps-to-a-kubernetes-cluster/">Deploying Node.js Apps to a Kubernetes Cluster</a>
5. <a href="https://medium.com/paul-zhao-projects/developing-and-deploying-a-node-js-app-from-docker-to-kubernetes-3aab28356719">Developing and deploying a Node.js app from Docker to Kubernetes</a>
