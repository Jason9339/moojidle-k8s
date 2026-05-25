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

Before deploying to AWS via K3S, we need to have both the frontend and backend images first (check [here](https://github.com/Jason9339/moojidle-k8s/pkgs/container/moojidle-k8s%2Ffrontend) for frontend, here for [here](https://github.com/Jason9339/moojidle-k8s/pkgs/container/moojidle-k8s%2Fbackend) for backend). If there's no available images on ghcr, refer to `DOCKER_README.md` for instructions about image building steps. The following is the steps to deploy moojidle to AWS via k3s:

### Manually (For best learning experience)

### Automation via Terraform (The Industry Best Practice)

## Demo Video Link

## Final Presentation
