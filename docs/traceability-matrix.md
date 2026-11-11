# Traceability matrix

Links each Jira story to its test cases, the automated spec that covers them and the current result.
Result legend: ✅ passing · 🐞 known bug, documented with `test.fail()` (expected failure).

| Jira story | Test case | Type | Spec | Result |
| --- | --- | --- | --- | --- |
| SCRUM-1 Login | TC-01 Login with standard user lands on `/inventory.html` | Functional | `tests/login/SCRUM-1-login-saucedemo.spec.ts` | ✅ |
| SCRUM-1 Login | TC-02 Logout from the side menu returns to the login page | Functional | `tests/login/SCRUM-1-login-saucedemo.spec.ts` | ✅ |
| Login | TC-03 Successful login shows the product list | Functional | `tests/login/login.spec.ts` | ✅ |
| Login | TC-04 Locked user is rejected with "locked out" message | Negative | `tests/login/locked-user.spec.ts` | ✅ |
| Products | TC-05 Product detail shows name and price, add to cart from detail | Functional | `tests/productos/select-product.spec.ts` | ✅ |
| Cart | TC-06 Cart shows the added product with name, price and quantity | Functional | `tests/carrito/verify-cart.spec.ts` | ✅ |
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
| E2E | TC-18 Login → add product → cart → price checked against API → logout | End-to-end | `tests/e2e/compra-completa.spec.ts` | ✅ |
| Price API | TC-19 Valid product returns `200` and the correct price | API | `tests/api/producto.spec.ts` | ✅ |
| Price API | TC-20 / BUG-04 Unknown product should return `404` (returns `200` + price `0`) | API defect | `tests/api/producto.spec.ts` | 🐞 |
| Booking API – auth | TC-21 `POST /auth` with valid credentials returns a token (schema) | API | `tests/api/booking/booking.spec.ts` | ✅ |
| Booking API – auth | TC-22 / BUG-05 Invalid credentials should return `401` | API defect | `tests/api/booking/booking.spec.ts` | 🐞 |
| Booking API – CRUD | TC-23 `POST /booking` creates a booking and matches the contract | API / contract | `tests/api/booking/booking.spec.ts` | ✅ |
| Booking API – CRUD | TC-24 `GET /booking/{id}` returns the created booking | API / contract | `tests/api/booking/booking.spec.ts` | ✅ |
| Booking API – CRUD | TC-25 `GET /booking` lists ids and includes the new booking | API / contract | `tests/api/booking/booking.spec.ts` | ✅ |
| Booking API – CRUD | TC-26 `PUT` with token updates all fields and changes persist | API | `tests/api/booking/booking.spec.ts` | ✅ |
| Booking API – CRUD | TC-27 `PATCH` changes only the field sent | API | `tests/api/booking/booking.spec.ts` | ✅ |
| Booking API – CRUD | TC-28 `DELETE` with token removes the booking (then `404`) | API | `tests/api/booking/booking.spec.ts` | ✅ |
| Booking API – permissions | TC-29 `PUT` without token is rejected with `403` and data is unchanged | API / security | `tests/api/booking/booking.spec.ts` | ✅ |
| Booking API – permissions | TC-30 `DELETE` without token is rejected with `403` and booking still exists | API / security | `tests/api/booking/booking.spec.ts` | ✅ |
| Booking API – validation | TC-31 / BUG-06 Missing required fields should return `400` | API defect | `tests/api/booking/booking.spec.ts` | 🐞 |
| Booking API – validation | TC-32 / BUG-07 Negative price and checkout before checkin should be rejected | API defect | `tests/api/booking/booking.spec.ts` | 🐞 |
| Booking API – validation | TC-33 / BUG-08 Successful delete should return `200`/`204` | API defect | `tests/api/booking/booking.spec.ts` | 🐞 |

## Defect log

| ID | Area | Summary | Expected | Actual | Severity |
| --- | --- | --- | --- | --- | --- |
| BUG-01 | Products (problem_user) | All products show the same image | Each product shows its own image | Same image for all 6 products | Medium |
| BUG-02 | Products (problem_user) | Price sorting does nothing | List ordered by price, low to high | List order does not change | Medium |
| BUG-03 | Checkout (problem_user) | Last name goes into the first name field | Last name stays in "Last Name" | Text is written into "First Name"; checkout cannot continue | High |
| BUG-04 | Price API | Unknown product returns a price | `404` or error body | `200` + `{ "precio": 0 }` | High |
| BUG-05 | Booking API | Invalid login returns 200 | `401 Unauthorized` | `200` + `{ "reason": "Bad credentials" }` | Medium |
| BUG-06 | Booking API | Incomplete booking crashes the server | `400 Bad Request` | `500 Internal Server Error` | High |
| BUG-07 | Booking API | Invalid booking data is accepted | `400` for negative price / checkout before checkin | `200`, booking created | High |
| BUG-08 | Booking API | Wrong status code on delete | `200 OK` or `204 No Content` | `201 Created` | Low |

Each defect is also filed as a GitHub Issue with steps, evidence, severity and priority. UI evidence: [`docs/bugs/`](bugs/).
