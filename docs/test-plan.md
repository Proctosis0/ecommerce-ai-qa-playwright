# Test plan – SauceDemo store and supporting APIs

| | |
| --- | --- |
| **Author** | Jose Balleste |
| **Version** | 1.0 – November 2026 |
| **Systems under test** | [SauceDemo](https://www.saucedemo.com) web store · Product price API (course API) · [Restful-Booker](https://restful-booker.herokuapp.com) API |
| **Related** | [Traceability matrix](traceability-matrix.md) · [Test summary report](test-summary-report.md) |

## 1. Objective

Validate that the main purchase journey of the store works end to end (login → product list → cart → checkout), that its business rules and validations are correct, and that the supporting APIs respect their contract, permissions and HTTP semantics. Defects found must be documented with evidence and covered by a regression test.

## 2. Scope

**In scope**

| Area | What is covered |
| --- | --- |
| Login | Valid login, locked user, logout |
| Products | Product list, product detail, price, add to cart |
| Cart | Add and remove products, cart badge, contents and prices |
| Checkout | Required-field validations, subtotal, tax (8%), total, order confirmation |
| Special users | `problem_user` behavior compared against `standard_user` |
| Price API | Price lookup for valid and unknown products, UI vs API price consistency |
| Booking API | Authentication, CRUD, permissions (token), input validation, response contract |

**Out of scope**

- Performance and load testing (planned with JMeter).
- Cross-browser execution (Chromium only; the app is a single-page demo with no browser-specific logic in scope).
- Visual regression (baselines differ between operating systems and would produce noise).
- Real payments and back-office (not provided by the demo).

## 3. Approach

| Technique | Where it is applied |
| --- | --- |
| Requirements-based testing | Each Jira story (SCRUM-n) is turned into test cases; see the traceability matrix |
| Equivalence partitioning | Checkout form: one invalid case per required field + valid data |
| Negative testing | Locked user, invalid credentials, missing fields, invalid booking data, unknown product |
| Comparative testing | `problem_user` vs `standard_user` to confirm a failure is a product defect and not a test defect |
| Contract testing | API responses validated against Zod schemas (types, required fields, no unexpected fields) |
| Security / permissions | Update and delete without token must be rejected |
| End-to-end | Full purchase journey with a cross-check of the UI price against the API |

**Automation:** Playwright + TypeScript, Page Object Model with fixtures, data-driven tests, session reuse (`storageState`). Tests are generated from Jira stories with an AI agent (Jira MCP + Playwright Test MCP) and always reviewed and refactored before commit.

## 4. Test environment and data

- Public demo environments listed above; no private data is used.
- Users: `standard_user`, `locked_out_user`, `problem_user` (public demo users), configurable through environment variables.
- Test data lives in `data/test-data.ts`. API tests create their own bookings and delete them at the end, so they do not depend on the state of a shared public API.

## 5. Entry and exit criteria

**Entry**
- Story available in Jira with steps and acceptance criteria.
- Environment reachable (SauceDemo and APIs respond).

**Exit**
- 100% of planned test cases executed.
- All non-defect tests passing in CI.
- Every defect found documented (GitHub Issue + defect log) and covered by a test marked as an expected failure.
- No open defect of severity High in the main purchase journey for `standard_user`.

## 6. Defect management

- Each defect gets an ID (BUG-nn), steps to reproduce, expected vs actual result, evidence, **severity** (impact) and **priority** (urgency).
- It is filed as a GitHub Issue and listed in the defect log.
- A test asserts the **correct** behavior and is marked with `test.fail()` and a `bug` annotation. The suite stays green while the defect exists; when it is fixed, the test reports "unexpectedly passed", which signals that the marker must be removed.

| Severity | Meaning |
| --- | --- |
| High | Blocks a business flow, loses or corrupts data, or the system accepts invalid data |
| Medium | Wrong behavior with a workaround, or misleading information to the user |
| Low | Cosmetic or protocol detail without functional impact |

## 7. Risks

| Risk | Mitigation |
| --- | --- |
| Public APIs are shared and can change or be slow | Each test creates and deletes its own data; one retry configured |
| Demo sites can change their HTML | Stable `data-test` selectors through `getByTestId()` |
| AI-generated tests can be wrong or brittle | Human review and refactor before commit; tests run in CI on every push |

## 8. Deliverables

- Automated test suite and CI pipeline (GitHub Actions).
- [Live HTML report](https://proctosis0.github.io/ecommerce-ai-qa-playwright/) of the latest run.
- [Traceability matrix and defect log](traceability-matrix.md).
- GitHub Issues for each defect.
- [Test summary report](test-summary-report.md).
