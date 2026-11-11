# Test summary report

| | |
| --- | --- |
| **Cycle** | November 2026 |
| **Author** | Jose Balleste |
| **Plan** | [Test plan](test-plan.md) |
| **Evidence** | [Live HTML report](https://proctosis0.github.io/ecommerce-ai-qa-playwright/) · [Traceability matrix](traceability-matrix.md) |

## 1. Summary

The main purchase journey of SauceDemo for `standard_user` (login, product list, cart, checkout and confirmation) **works as expected**: all its test cases pass. **8 defects** were found: 3 in the store when using `problem_user` and 5 in the APIs. None of them affects the main journey for `standard_user`, but 4 are High severity and should be fixed before relying on those areas.

## 2. Execution results

| Metric | Value |
| --- | --- |
| Test cases designed | 33 |
| Automated tests executed | 30 (+ 1 login setup) |
| Passed | 22 |
| Failed (documented defects, expected) | 8 |
| Unexpected failures | 0 |
| Flaky tests | 0 |
| Pass rate excluding known defects | 100% |
| Execution time (local, 10 workers) | ~8 s |

| Area | Tests | Passed | Known defects |
| --- | --- | --- | --- |
| Login | 3 | 3 | 0 |
| Products and cart | 3 | 3 | 0 |
| Checkout | 5 | 5 | 0 |
| `problem_user` | 3 | 0 | 3 |
| End-to-end | 1 | 1 | 0 |
| Price API | 2 | 1 | 1 |
| Booking API | 13 | 9 | 4 |

## 3. Defects

| ID | Area | Summary | Severity | Priority |
| --- | --- | --- | --- | --- |
| BUG-03 | Checkout (`problem_user`) | Last name is written into the first name field; checkout cannot continue | High | High |
| BUG-04 | Price API | Unknown product returns `200` with price `0` | High | High |
| BUG-06 | Booking API | Incomplete booking returns `500` instead of `400` | High | Medium |
| BUG-07 | Booking API | Negative price and checkout before checkin are accepted | High | High |
| BUG-01 | Products (`problem_user`) | All products show the same image | Medium | Medium |
| BUG-02 | Products (`problem_user`) | Price sorting does not change the order | Medium | Medium |
| BUG-05 | Booking API | Invalid login returns `200` instead of `401` | Medium | Low |
| BUG-08 | Booking API | Delete returns `201 Created` instead of `200`/`204` | Low | Low |

## 4. Recommendation

- **Main purchase journey (`standard_user`): GO.** All exit criteria are met for this flow.
- **Price API: NO-GO** until BUG-04 is fixed: a client could show an unknown product as free.
- **Booking API: NO-GO for public use** until BUG-06 and BUG-07 are fixed: the API accepts invalid data and returns server errors for client mistakes.
- `problem_user` defects are known by design in the demo; in a real product BUG-03 would block every purchase for the affected users.

## 5. Next steps

- Re-run the suite after each fix; the expected-failure tests will flag when a defect is resolved.
- Extend coverage: product sorting for `standard_user`, accessibility checks (axe-core), backend error simulation with network mocking.
- Add a performance smoke test with JMeter.
