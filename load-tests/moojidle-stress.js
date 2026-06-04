import http from 'k6/http';
import { check, sleep } from 'k6';

const TARGET_VUS = Number(__ENV.TARGET_VUS || 100);

export const options = {
  stages: [
    { duration: '30s', target: TARGET_VUS },
    { duration: '90s', target: TARGET_VUS },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<2000', 'p(99)<5000'],
  },
};

const BASE_URL = __ENV.BASE_URL;

export default function () {
  const home = http.get(BASE_URL);
  check(home, {
    'home page returns 200': (res) => res.status === 200,
  });

  const courses = http.get(`${BASE_URL}/api/course/list`);
  check(courses, {
    'course list is reachable': (res) => [200, 204, 304].includes(res.status),
  });

  sleep(1);
}
