# Moojidle in Kubernetes

## Table of Content

- [Credit](#credit)
- [Table of Content](#table-of-content)
- [Team Members](#team-members)
- [Instructions to Deploy HA K3S cluster on AWS](#instructions-to-deploy-ha-k3s-cluster-on-aws)
- [Demo Video Link](#demo-video-link)
- [Final Presentation](#final-presentation)

## Credit

**Important!** This project builds upon an inactive repository ([click me](https://gitlab.com/jingxiang0405/moojidle)) originally developed during the Spring 2025 Software Engineering course. Because that class has concluded, the original GitLab repository is no longer under active development, though it still houses the original CI pipeline, Jira and codebase history, team protocols, and final presentation. The primary objective of this current repository is to scale that initial design by deploying it to Amazon Web Services (AWS) using Kubernetes (K8s)."

This project began during the Spring 2026 term for the Distributed Systems course.

## Team Members

<details>
<summary>toggle to show</summary>

- 廖經翔
    - student ID: 111703003
- 游宗諺
    - student ID: 111703040
- 劉子宏
    - student ID: 111703044
- 黃鈺盛
    - student ID: 111703022
- 林子齊
    - student ID: 111703004
- 劉宸均
    - student ID: 112703016
</details>

## Instructions to Deploy HA K3S cluster on AWS

Before deploying the server, we need to prepare our MongoDB first (we use [Mongo Atlas](https://www.mongodb.com/products/platform/atlas-database) in this project). The following is the steps:

First, create a free cluster on [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database). Then migrate the seed data from our local database to Atlas using `mongodump` and `mongorestore`.

### Prepare MongoDB Atlas

<details>
<summary>(a) Create a Database User</summary>

Atlas → **Database Access** → **Add New Database User**
- Authentication Method: **Password**
- Custom username & password
- Atlas admin permission is sufficient
</details>

<details>
<summary>(b) Populate local MongoDB with seed data</summary>

Follow the instructions in [`project/database/README.md`](project/database/README.md) to set up your local MongoDB and insert the seed data.

```bash
# Then dump the local database
mongodump --db moojidle --out ./dump
```
</details>

<details>
<summary>(c) Restore to Atlas</summary>

Get your Atlas connection string: Atlas → **Clusters** → your cluster → **Connect** → **Drivers**

```bash
mongorestore --uri="mongodb+srv://<username>:<password>@cluster0.uyzxe9f.mongodb.net/" --db moojidle ./dump
```
</details>


Now let's start deploying to AWS via K3S, we need to have both the frontend and backend images first (check [here](https://github.com/Jason9339/moojidle-k8s/pkgs/container/moojidle-k8s%2Ffrontend) for frontend, here for [here](https://github.com/Jason9339/moojidle-k8s/pkgs/container/moojidle-k8s%2Fbackend) for backend). If there's no available images on ghcr, refer to `DOCKER_README.md` for instructions about image building steps. The following is the steps to deploy moojidle to [AWS](https://aws.amazon.com/console/) via [k3s](https://k3s.io/):

### Manually (For best learning experience)

**Notice**: All the following steps must be inside the same vpc.

<details>
<summary>Overall Network Flow</summary>

- For developers hitting `kubectl`:
    1. You type the kubectl command in your local terminal, which sends packets to the AWS NLB (Network LB).
    2. The NLB's security group intercepts and evaluates the traffic.
    3. The NLB forwards the packets to one of the Control Planes.
    4. That specific Control Plane's security group intercepts and evaluates the traffic.
    5. That Control Plane's API-Server receives the request.
    6. The API-Server writes this "state" into Etcd.
    7. The Scheduler discovers the new task, schedules it, and returns the result to the API-Server.
    8. A Worker Node (via Kubelet) claims the task.
- For client hitting `http Restful APIs`:
    1. A browser sends packets to the AWS ALB (Application LB).
    2. The ALB's security group intercepts and evaluates the traffic.
    3. The ALB forwards the packets to one of the Worker Nodes.
    4. That specific Worker Node's security group intercepts and evaluates the traffic.
    5. That Worker Node's svclb-traefik (Pod) receives the packet and calls the Ingress Service.
    6. The Ingress Service performs internal forwarding to an Ingress Pod (traefik) on one of the Worker Nodes (which might be different from the current one).
    7. The Ingress Pod routes the packets to the designated Service based on the Ingress Rules.
    8. That Service performs internal load balancing to the corresponding Pods.

</details>

<details>
<summary>STAGE 1: AWS EC2 Creation</summary>

1. Create 4 _Security Groups_:
    1. SG-Control-Plane: for all CP nodes
        - The main purpose of the SG is the inbound rules which controls what traffic can reach our machine, we need:
        - TCP/6443 -- 0.0.0.0/0 -- For Kubernetes API Server (NLB & Admin access) (0.0.0.0 is set for any local computer)
        - TCP/(2379-2380) -- SG-Control-Plane -- Embedded etcd communication between CP nodes
        - TCP/10250 -- SG-Control-Plane -- Kubelet metrics
        - TCP/10250 -- SG-Worker -- Kubelet metrics
        - UDP/8472 -- SG-Control-Plane -- Flannel VXLAN overlay network
        - UDP/8472 -- SG-Worker -- Flannel VXLAN overlay network
        - SSH/- -- 0.0.0.0/0 -- For any local computer to ssh to the VM
    2. SG-Worker: for all worker nodes
        - TCP/10250 -- SG-Control-Plane -- Kubelet metrics (Notice that we only need the inbound from CP nodes)
        - UDP/8472 -- SG-Control-Plane -- Flannel VXLAN overlay network
        - UDP/8472 -- SG-Worker -- Flannel VXLAN overlay network
        - SSH/- -- 0.0.0.0/0 -- For any local computer to ssh to the VM
        - HTTP/- -- SG-ALB -- Catching traffic from ALB
    3. SG-NLB: for the load balancer in front of the CP nodes
        - TCP/6443 -- 0.0.0.0/0 -- Kubernetes API Server traffic
    4. SG-ALB: for the load balancer in front of the worker nodes
        - HTTP/- -- 0.0.0.0/0 -- Client traffic
        - HTTPS/- -- 0.0.0.0/0 -- Client traffic
2. Create 3 control plane nodes (_t3.Medium_) and 2 worker nodes (_t3.Small_), apply `SG-Control-Plane` and `SG-Worker` to the corresponding ones and generate a `.pem` ssh key pair for future ssh connection. (remember to select Ubuntu, do not choose Amazon Linux).
3. Create 2 _Target Groups_:
    1. TG-Control-Planes: Target type is _Instance_ --> Protocol/Port is TCP/6443 --> Add Control Plane nodes
    2. TG-Workers: Target type is _Instance_ --> Protocol/Port is HTTP/80 --> Add Worker nodes
4. Create 2 _Load balancers_:
    1. NLB: Network Load Balancer --> Internet-facing --> Apply `SG-NLB` --> Protocol/Port is TCP/6443 --> Add `TG-Control-Planes`
    1. NLB: Application Load Balancer --> Internet-facing --> Apply `SG-ALB` --> Protocol/Port is HTTP/80 --> Add `TG-Workers`

</details>

<details>
<summary>STAGE 2: AWS EC2 Configuartion</summary>

1. SSH into the first Control Plane: `ssh -i your-key.pem ubuntu@your_public_ip`
2. `sudo su`
3. `apt update`
4. Obtain `<YOUR_NLB_DNS_NAME>` from the LB console, it usually looks something like `Control-Plane-LB-f8361373163f6116.elb.ap-northeast-1.amazonaws.com`. Run:
    ```Bash
    curl -sfL https://get.k3s.io | sh -s - server \
    --cluster-init \
    --tls-san <YOUR_NLB_DNS_NAME>
    ```
5. `cat /var/lib/rancher/k3s/server/node-token` and note it down. We will refer to this as `<YOUR_NODE_TOKEN>`
6. SSH into the 2nd and 3rd Control Planes. Just like steps `2` and `3`, run `apt update` first, then execute:
    ```Bash
    curl -sfL https://get.k3s.io | sh -s - server \
    --server https://<NODE_1_PRIVATE_IP>:6443 \
    --token <YOUR_NODE_TOKEN> \
    --tls-san <YOUR_NLB_DNS_NAME>
    ```
7. SSH into the 1st and 2nd Worker Nodes. Just like steps `2` and `3`, run `apt update` first, then execute: 
    ```Bash
    curl -sfL https://get.k3s.io | K3S_URL=https://<YOUR_NLB_DNS_NAME>:6443 K3S_TOKEN=<YOUR_NODE_TOKEN> sh -
    ```

</details>

<details>
<summary>STAGE 3: Kubectl Verification</summary>

1. SSH back into the one of the Control Plane node, run `sudo cat /etc/rancher/k3s/k3s.yaml`, and copy the output
2. Paste it into `~/.kube/config` on your local machine (remember to back up the original first).
3. Modify the `server:` line in `~/.kube/config` to: `server: https://<YOUR_NLB_DNS_NAME>:6443`
4. Run `kubectl get nodes` directly on your local machine. You should successfully see 5 nodes~
    ```Bash
    $ kubectl get nodes
    NAME               STATUS   ROLES               AGE     VERSION
    ip-172-31-36-209   Ready    control-plane,etcd  14m     v1.35.4+k3s1
    ip-172-31-37-112   Ready    <none>              7m3s    v1.35.4+k3s1
    ip-172-31-37-159   Ready    control-plane,etcd  13m     v1.35.4+k3s1
    ip-172-31-37-7     Ready    <none>              7m57s   v1.35.4+k3s1
    ip-172-31-44-167   Ready    control-plane,etcd  23m     v1.35.4+k3s1
    ```

</details>

<details>
<summary>STAGE 4: Deploy Pods</summary>

1. `cd ./deploy`
2. `kubectl apply -f backend.yml`
3. `kubectl apply -f frontend.yml`
4. `kubectl apply -f ingress-rule.yml`
5. run `kubectl get all` and `kubectl get all -n kube-system` to check if the pods and other components are working
6. Try running `curl http://<YOUR_APP_LB_DNS_NAME>`. It should be successful!
7. run `kubectl scale deployment -n kube-system traefik --replicas 3` to make it really HA

</details>

### Automation via Terraform (The Industry Best Practice)

Because we have already understand the process of deploying our HA cluster manually, please refer to the following folders to starightly config the IaC (Infrastructure as Code):
- `terraform/aws-k3s` for IaC itself
- `scripts` for One-click Deployment (Note: we straightly use bash script to mimic cloud-init funstionalities)

## Demo Video Link

## Final Presentation
