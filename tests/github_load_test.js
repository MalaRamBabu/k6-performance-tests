import http from 'k6/http';
import { check, sleep, group } from 'k6';

// ============================================================
// K6 Performance Test Suite — GitHub REST API
// Author: Portfolio Project
// Target: https://api.github.com (public, no auth needed)
// ============================================================

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m',  target: 10 },
    { duration: '30s', target: 20 },
    { duration: '1m',  target: 20 },
    { duration: '30s', target: 0  },
  ],

  thresholds: {
    http_req_duration: ['p95<1000'],
    http_req_failed:   ['rate<0.02'],
    'http_req_duration{group:::GitHub API::GET user}':   ['p95<800'],
    'http_req_duration{group:::GitHub API::GET repos}':  ['p95<1000'],
    'http_req_duration{group:::GitHub API::GET search}': ['p95<1500'],
    checks: ['rate>0.95'],
  },
};

const BASE_URL = 'https://api.github.com';
const HEADERS  = {
  'Accept':     'application/vnd.github.v3+json',
  'User-Agent': 'k6-performance-test',
};

export default function () {

  group('GitHub API::GET user', () => {
    const res = http.get(`${BASE_URL}/users/octocat`, { headers: HEADERS });
    check(res, {
      'status is 200':           (r) => r.status === 200,
      'response time < 800ms':   (r) => r.timings.duration < 800,
      'has login field':         (r) => r.json('login') === 'octocat',
      'has public_repos field':  (r) => r.json('public_repos') !== undefined,
    });
    sleep(1);
  });

  group('GitHub API::GET repos', () => {
    const res = http.get(`${BASE_URL}/users/octocat/repos?per_page=10`, { headers: HEADERS });
    check(res, {
      'status is 200':          (r) => r.status === 200,
      'response time < 1000ms': (r) => r.timings.duration < 1000,
      'returns array':          (r) => Array.isArray(r.json()),
      'has repos':              (r) => r.json().length > 0,
      'first repo has name':    (r) => r.json()[0] && r.json()[0].name !== undefined,
    });
    sleep(1);
  });

  group('GitHub API::GET search', () => {
    const res = http.get(
      `${BASE_URL}/search/repositories?q=k6+performance+testing&sort=stars&per_page=5`,
      { headers: HEADERS }
    );
    check(res, {
      'status is 200':              (r) => r.status === 200,
      'response time < 1500ms':     (r) => r.timings.duration < 1500,
      'has total_count':            (r) => r.json('total_count') > 0,
      'has items array':            (r) => Array.isArray(r.json('items')),
      'items have full_name field': (r) => r.json('items')[0] && r.json('items')[0].full_name !== undefined,
    });
    sleep(2);
  });

  group('GitHub API::GET rate limit', () => {
    const res = http.get(`${BASE_URL}/rate_limit`, { headers: HEADERS });
    check(res, {
      'status is 200':                  (r) => r.status === 200,
      'response time < 500ms':          (r) => r.timings.duration < 500,
      'has rate object':                (r) => r.json('rate') !== undefined,
      'limit is 60 (unauthenticated)':  (r) => r.json('rate.limit') === 60,
    });
    sleep(1);
  });
}

export function setup() {
  console.log('========================================');
  console.log('  K6 GitHub API Performance Test Suite  ');
  console.log('  Target: https://api.github.com        ');
  console.log('========================================');
  const res = http.get(`${BASE_URL}/zen`, { headers: HEADERS });
  if (res.status !== 200) {
    throw new Error(`GitHub API not reachable! Status: ${res.status}`);
  }
  console.log(`GitHub API is UP. Zen: "${res.body}"`);
}

export function teardown() {
  console.log('========================================');
  console.log('  Test Complete! Check results above.   ');
  console.log('========================================');
}
