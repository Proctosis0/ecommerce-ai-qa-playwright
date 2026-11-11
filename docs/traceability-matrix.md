# Traceability matrix

Links each Jira story to its test cases, the automated spec that covers them and the current result.

**Jira structure:** Epic → Stories → test cases; defects are Jira *Bug* items linked to their story. Every test is tagged with its Jira key (e.g. `{ tag: '@SCRUM-6' }`), so a story can be re-tested with `npx playwright test --grep "@SCRUM-6"`.

| Epic | Stories | Status |
| --- | --- | --- |
| SCRUM-8 Online purchase on SauceDemo | SCRUM-1 Login · SCRUM-5 Add/remove from cart · SCRUM-6 Checkout · SCRUM-7 problem_user defects · SCRUM-10 Product detail & add to cart | In progress |
| SCRUM-9 Supporting APIs: prices and bookings | SCRUM-11 Price API & purchase check · SCRUM-12 Booking API | In progress |

SCRUM-11 and SCRUM-12 stay **In progress** on purpose: some of their acceptance criteria fail because of open defects, so they are not closed until those are fixed.
Result legend: ✅ passing · 🐞 known bug, documented with `test.fail()` (expected failure).

| Jira story | Test case | Type | Spec | Result |
| --- | --- | --- | --- | --- |
| SCRUM-1 Login | TC-01 Login with standard user lands on `/inventory.html` | Functional | `tests/login/SCRUM-1-login-saucedemo.spec.ts` | ✅ |
| SCRUM-1 Login | TC-02 Logout from the side menu returns to the login page | Functional | `tests/login/SCRUM-1-login-saucedemo.spec.ts` | ✅ |
| SCRUM-1 Login | TC-03 Successful login shows the product list | Functional | `tests/login/login.spec.ts` | ✅ |
| SCRUM-1 Login | TC-04 Locked user is rejected with "locked out" message | Negative | `tests/login/locked-user.spec.ts` | ✅ |
| SCRUM-10 Product detail & add to cart | TC-05 Product detail shows name and price, add to cart from detail | Functional | `tests/productos/select-product.spec.ts` | ✅ |
| SCRUM-10 Product detail & add to cart | TC-06 Cart shows the added product with name, price and quantity | Functional | `tests/carrito/verify-cart.spec.ts` | ✅ |
| SCRUM-5 Add/remove from cart | TC-07 Adding two products updates badge to 2 and buttons to "Remove" | Functional | `tests/carrito/SCRUM-5-agregar-quitar-productos.spec.ts` | ✅ |
| SCRUM-5 Add/remove from cart | TC-08 Removing from the cart leaves one product and badge 1 | Functional | `tests/carrito/SCRUM-5-agregar-quitar-productos.spec.ts` | ✅ |
| SCRUM-5 Add/remove from cart | TC-09 Removing from the product list hides the badge | Functional | `tests/carrito/SCRUM-5-agregar-quitar-productos.spec.ts` | ✅ |
| SCRUM-6 Checkout | TC-10 All fields empty → "First Name is required" | Negative (data-driven) | `tests/checkout/SCRUM-6-checkout-validaciones.spec.ts` | ✅ |
| SCRUM-6 Checkout | TC-11 Missing first name → "First Name is required" | Negative (data-driven) | `tests/checkout/SCRUM-6-checkout-validaciones.spec.ts` | ✅ |
| SCRUM-6 Checkout | TC-12 Missing last name → "Last Name is required" | Negative (data-driven) | `tests/checkout/SCRUM-6-checkout-validaciones.spec.ts` | ✅ |
| SCRUM-6 Checkout | TC-13 Missing postal code → "Postal Code is required" | Negative (data-driven) | `tests/checkout/SCRUM-6-checkout-validaciones.spec.ts` | ✅ |
| SCRUM-6 Checkout | TC-14 Valid data: subtotal, 8% tax and total are correct; order completes and cart is emptied | Functional | `tests/checkout/SCRUM-6-checkout-validaciones.spec.ts` | ✅ |
| SCRUM-7 problem_user defects | TC-15 / BUG-01 Each product shows its own image | Defect | `tests/bugs/SCRUM-7-problem-user.spec.ts` | 🐞 |
| SCRUM-7 problem_user defects | TC-16 / BUG-02 Sorting by price (low to high) orders the list | Defect | `tests/bugs/SCRUM-7-problem-user.spec.ts` | 🐞 |
| SCRUM-7 problem_user defects | TC-17 / BUG-03 Last name typed in checkout stays in its field | Defect | `tests/bugs/SCRUM-7-problem-user.spec.ts` | 🐞 |
| SCRUM-11 Price API & purchase check | TC-18 Login → add product → cart → price checked against API → logout | End-to-end | `tests/e2e/compra-completa.spec.ts` | ✅ |
| SCRUM-11 Price API & purchase check | TC-19 Valid product returns `200` and the correct price | API | `tests/api/producto.spec.ts` | ✅ |
| SCRUM-11 Price API & purchase check | TC-20 / BUG-04 Unknown product should return `404` (returns `200` + price `0`) | API defect | `tests/api/producto.spec.ts` | 🐞 |
| SCRUM-12 Booking API | TC-21 `POST /auth` with valid credentials returns a token (schema) | API | `tests/api/booking/booking.spec.ts` | ✅ |
| SCRUM-12 Booking API | TC-22 / BUG-05 Invalid credentials should return `401` | API defect | `tests/api/booking/booking.spec.ts` | 🐞 |
| SCRUM-12 Booking API | TC-23 `POST /booking` creates a booking and matches the contract | API / contract | `tests/api/booking/booking.spec.ts` | ✅ |
| SCRUM-12 Booking API | TC-24 `GET /booking/{id}` returns the created booking | API / contract | `tests/api/booking/booking.spec.ts` | ✅ |
| SCRUM-12 Booking API | TC-25 `GET /booking` lists ids and includes the new booking | API / contract | `tests/api/booking/booking.spec.ts` | ✅ |
| SCRUM-12 Booking API | TC-26 `PUT` with token updates all fields and changes persist | API | `tests/api/booking/booking.spec.ts` | ✅ |
| SCRUM-12 Booking API | TC-27 `PATCH` changes only the field sent | API | `tests/api/booking/booking.spec.ts` | ✅ |
| SCRUM-12 Booking API | TC-28 `DELETE` with token removes the booking (then `404`) | API | `tests/api/booking/booking.spec.ts` | ✅ |
| SCRUM-12 Booking API | TC-29 `PUT` without token is rejected with `403` and data is unchanged | API / security | `tests/api/booking/booking.spec.ts` | ✅ |
| SCRUM-12 Booking API | TC-30 `DELETE` without token is rejected with `403` and booking still exists | API / security | `tests/api/booking/booking.spec.ts` | ✅ |
| SCRUM-12 Booking API | TC-31 / BUG-06 Missing required fields should return `400` | API defect | `tests/api/booking/booking.spec.ts` | 🐞 |
| SCRUM-12 Booking API | TC-32 / BUG-07 Negative price and checkout before checkin should be rejected | API defect | `tests/api/booking/booking.spec.ts` | 🐞 |
| SCRUM-12 Booking API | TC-33 / BUG-08 Successful delete should return `200`/`204` | API defect | `tests/api/booking/booking.spec.ts` | 🐞 |

## Defect log

| ID | Jira | GitHub | Area | Summary | Expected | Actual | Severity |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BUG-01 | SCRUM-13 | [#1](https://github.com/Proctosis0/ecommerce-ai-qa-playwright/issues/1) | Products (problem_user) | All products show the same image | Each product shows its own image | Same image for all 6 products | Medium |
| BUG-02 | SCRUM-14 | [#2](https://github.com/Proctosis0/ecommerce-ai-qa-playwright/issues/2) | Products (problem_user) | Price sorting does nothing | List ordered by price, low to high | List order does not change | Medium |
| BUG-03 | SCRUM-15 | [#3](https://github.com/Proctosis0/ecommerce-ai-qa-playwright/issues/3) | Checkout (problem_user) | Last name goes into the first name field | Last name stays in "Last Name" | Text is written into "First Name"; checkout cannot continue | High |
| BUG-04 | SCRUM-16 | [#4](https://github.com/Proctosis0/ecommerce-ai-qa-playwright/issues/4) | Price API | Unknown product returns a price | `404` or error body | `200` + `{ "precio": 0 }` | High |
| BUG-05 | SCRUM-17 | [#5](https://github.com/Proctosis0/ecommerce-ai-qa-playwright/issues/5) | Booking API | Invalid login returns 200 | `401 Unauthorized` | `200` + `{ "reason": "Bad credentials" }` | Medium |
| BUG-06 | SCRUM-18 | [#6](https://github.com/Proctosis0/ecommerce-ai-qa-playwright/issues/6) | Booking API | Incomplete booking crashes the server | `400 Bad Request` | `500 Internal Server Error` | High |
| BUG-07 | SCRUM-19 | [#7](https://github.com/Proctosis0/ecommerce-ai-qa-playwright/issues/7) | Booking API | Invalid booking data is accepted | `400` for negative price / checkout before checkin | `200`, booking created | High |
| BUG-08 | SCRUM-20 | [#8](https://github.com/Proctosis0/ecommerce-ai-qa-playwright/issues/8) | Booking API | Wrong status code on delete | `200 OK` or `204 No Content` | `201 Created` | Low |

Each defect is a Jira *Bug* (linked to its story, with priority) and a public GitHub Issue with steps, evidence, severity and priority. UI evidence: [`docs/bugs/`](bugs/).
