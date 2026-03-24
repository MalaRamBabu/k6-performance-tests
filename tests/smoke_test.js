import http from 'k6/http';
import { check } from 'k6';

// ============================================================
// Smoke Test — Run FIRST to verify all endpoints are reachable
// Usage: k6 run tests/smoke_test.js
// ============================================================

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: {
    http_req_duration: ['p95<2000'],
    http_req_failed:   ['rate<0.01'],
  },
};

const BASE_URL = 'https://api.github.com';
const HEADERS  = { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'k6-smoke-test' };

export default function () {
  let res;

  res = http.get(`${BASE_URL}/zen`, { headers: HEADERS });
  check(res, { 'zen: status 200': (r) => r.status === 200 });

  res = http.get(`${BASE_URL}/users/octocat`, { headers: HEADERS });
  check(res, {
    'user: status 200': (r) => r.status === 200,
    'user: has login':  (r) => r.json('login') !== undefined,
  });

  res = http.get(`${BASE_URL}/users/octocat/repos`, { headers: HEADERS });
  check(res, {
    'repos: status 200': (r) => r.status === 200,
    'repos: is array':   (r) => Array.isArray(r.json()),
  });

  res = http.get(`${BASE_URL}/search/repositories?q=k6&per_page=3`, { headers: HEADERS });
  check(res, {
    'search: status 200':  (r) => r.status === 200,
    'search: has results': (r) => r.json('total_count') > 0,
  });

  console.log('✅ Smoke test passed — all endpoints reachable!');
}
