# k6 Load Tests

These scripts are used to verify deployment health, observe resource usage, and demonstrate HPA autoscaling.

## Smoke test

Small load test for checking whether the app is reachable after deployment.

```bash
BASE_URL=https://你的網域 k6 run load-tests/moojidle-smoke.js
```

## Analysis test

Moderate load test for collecting baseline latency, RPS, CPU, and memory observations.

```bash
BASE_URL=https://你的網域 k6 run load-tests/moojidle-analysis.js
```

## HPA stress test

Stress test for observing HPA scale-out behavior. Change `TARGET_VUS` to test different load levels, such as `100` or `200`.

```bash
BASE_URL=https://你的網域 TARGET_VUS=200 k6 run load-tests/moojidle-stress.js
```

During the test, watch HPA, pods, and container resource usage:

```bash
watch -n 1 'KUBECONFIG=~/.kube/moojidle-config kubectl get hpa'
watch -n 1 'KUBECONFIG=~/.kube/moojidle-config kubectl get pods'
watch -n 1 'KUBECONFIG=~/.kube/moojidle-config kubectl top pods --containers'
```
