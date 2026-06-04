# Kubernetes Components

The following explains the components used in this project. Follow the [Manual Instructions](https://github.com/Jason9339/moojidle-k8s#manually-for-best-learning-experience) for better learning experience

## backend-secret.yml

This local-only manifest stores the MongoDB Atlas connection string as a Kubernetes Secret. Copy `backend-secret.yml.example` to `backend-secret.yml` and fill in `DATA_BASE_URL` before deployment.

`backend-secret.yml` is ignored by git and must not be committed.

## backend.yml

First, we introduce the backend of moojidle. There are 3 k8s components in this yaml file:
- ConfigMap: For the Express server's listening port
- Deployment: Declaring the replicas, CPU/memory requests, and use both _Secret_ and _ConfigMap_ here for best practice
- Service: The internal LB for all of our backend pods

## frontend.yml

For the frontend of moojidle, there are 3 k8s components in the yaml file:
- ConfigMap: For the NginX server's config
- Deployment: Declaring the replicas, CPU/memory requests, and use the _ConfigMap_ here for best practice
- Service: The internal LB for all of our frontend pods

## hpa.yml

This manifest configures HorizontalPodAutoscaler for backend and frontend deployments. K3s includes metrics-server by default, and HPA uses the CPU requests declared in `backend.yml` and `frontend.yml` to calculate CPU utilization.

## ingress-rule.yml

Since k3s (our deploying distribution) use traefik as their default LB, instead of configuring the rule in nginx-style, we follow the traefik's default best practice (using _Middleware_). The rules are:
- If the request from the browser starts with `/api`, we strip this prefix and pass to our backend _Service_
- If the request from the browser starts with `/` only, we simply pass the request to frontend _Service_ to return the static `index.html`
