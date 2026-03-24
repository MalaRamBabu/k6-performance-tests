import http from 'k6/http';
import { check, sleep } from 'k6';

// ============================================================
// Spike Test — Sudden traffic burst simulation
// Usage: k6 run tests/spike_test.js
// ============================================================

export const options = {
  stages: [
    { duration: '10s', target: 1  },
    { duration: '10s', target: 50 },
    { duration: '30s', target: 50 },
    { duration: '10s', target: 1  },
    { duration: '10s', target: 0  },
  ],
  thresholds: {
    http_req_duration: ['p95<2000'],
    http_req_failed:   ['rate<0.05'],
  },
};

const BASE_URL = 'https://api.github.com';
const HEADERS  = { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'k6-spike-test' };

export default function () {
  const res = http.get(`${BASE_URL}/users/octocat`, { headers: HEADERS });
  check(res, {
    'status is 200':          (r) => r.status === 200,
    'response time < 2000ms': (r) => r.timings.duration < 2000,
  });
  sleep(0.5);
}
