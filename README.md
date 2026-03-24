# 🚀 K6 Performance Tests — GitHub API

> Performance testing suite for the GitHub REST API using [K6](https://k6.io/)  
> Portfolio project demonstrating load, smoke, and spike testing.

---

## 📁 Project Structure

```
k6-performance-tests/
├── tests/
│   ├── smoke_test.js          # Quick sanity check (1 VU, 1 iteration)
│   ├── github_load_test.js    # Main load test — ramp up/down + thresholds
│   └── spike_test.js          # Sudden traffic burst simulation
└── README.md
```

---

## 🧪 How to Run

### Step 1 — Smoke Test (always run first)
```bash
k6 run tests/smoke_test.js
```
Checks all endpoints are reachable before load testing.

### Step 2 — Load Test (main test)
```bash
k6 run tests/github_load_test.js
```
Ramps from 10 → 20 virtual users with CI/CD-ready thresholds.

### Step 3 — Spike Test
```bash
k6 run tests/spike_test.js
```
Simulates 50 users hitting the API suddenly.

### Generate HTML Report
```bash
k6 run --out json=results.json tests/github_load_test.js
npx k6-reporter results.json
```

---

## 📊 Endpoints Tested

| Endpoint | Description |
|---|---|
| `GET /zen` | GitHub healthcheck |
| `GET /users/octocat` | Public user profile |
| `GET /users/octocat/repos` | List public repos |
| `GET /search/repositories` | Search by keyword |
| `GET /rate_limit` | API rate limit status |

---

## ✅ Thresholds

| Metric | Threshold |
|---|---|
| p95 response time | < 1000ms |
| Failure rate | < 2% |
| Check pass rate | > 95% |

Thresholds cause K6 to **exit with a non-zero code** — auto-fails CI/CD pipelines.

---

## 🛠️ Installation

```bash
# Mac
brew install k6

# Windows
winget install k6

# Linux
sudo apt-get install k6
```

---

**Tools:** K6 · JavaScript · GitHub REST API  
**Skills:** Performance Testing · Load Testing · Smoke Testing · Spike Testing

---

## Author

**Mala Ram Babu**
Senior QA Automation Engineer | 4+ Years Experience
[LinkedIn](https://www.linkedin.com/in/mala-ram-babu) | [GitHub](https://github.com/MalaRamBabu)