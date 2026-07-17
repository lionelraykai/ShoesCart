# Shoe Cart

A React Native (Expo) shopping app for a shoe store, built as a take-home exercise. It has two
experiences in one app, behind a real login/signup flow:

- **User** — browse a shoe catalog, view details, pick a size, add to cart, and place an order
  (no payment step). A floating cart banner is reachable from anywhere in the app once the cart
  has items.
- **Admin** — add, edit, and delete shoes in the catalog (brand, name, price, available sizes,
  and an optional photo), and view all orders placed by every shopper.

All data (accounts, catalog, cart, and orders) is stored locally on the device with
[redux-persist](https://github.com/rt2zz/redux-persist) backed by
[`@react-native-async-storage/async-storage`](https://react-native-async-storage.github.io/async-storage/) —
there is no backend or API.

## Getting started

Requires Node 20+ and npm.

```bash
npm install
npx expo start
```

This opens the Expo CLI, from which you can run the app in:

- a web browser (press `w`, or run `npm run web`)
- iOS Simulator (press `i`, or run `npm run ios` — macOS + Xcode required)
- Android Emulator (press `a`, or run `npm run android` — Android Studio required)
- the [Expo Go](https://expo.dev/go) app on a physical device, by scanning the QR code

The web target is the fastest way to try the app and is what the screen recording was captured
from.

### Running tests

```bash
npm test
```

Unit tests cover the Redux reducers (`authSlice`, `shoesSlice`, `cartSlice`, `ordersSlice`) — the
core business logic for accounts, the catalog, cart, and checkout flow.

### Other scripts

```bash
npm run lint        # ESLint
npx tsc --noEmit     # TypeScript
```

## Trying Admin vs. User

The app opens on a **Log In** screen. Two demo accounts are seeded so you can try both roles
immediately — tap either one on the login screen to fill the form, then **Log In**:

| Role  | Email               | Password  |
| ----- | ------------------- | --------- |
| Admin | `admin@shoecart.app` | `admin123` |
| User  | `user@shoecart.app`  | `user123`  |

Signing in as Admin swaps the first tab from "Shop" to "Manage Shoes", hides the Cart tab, and
shows every shopper's orders (with a Customer column) under Orders. Signing in as a User shows
the shopping tabs and scopes the Orders tab to that account's own orders.

You can also tap **Sign up** to create a new account — new accounts are always created as a
"User" (see [IMPROVEMENTS.md](IMPROVEMENTS.md) for why Admin isn't self-service). Log out from the
**Profile** tab.

## Architecture

```
src/
  app/                  expo-router file-based routes (thin — params + store wiring only)
    _layout.tsx          Redux/PersistGate/Paper/Theme providers + root Stack + CartBanner
    login.tsx, signup.tsx auth screens (only reachable when logged out — see Stack.Protected)
    (tabs)/               the four main tabs (role-aware, only reachable when logged in)
    shoe/[id].tsx         shoe detail, pushed as a modal from Shop
    admin/[id].tsx         add/edit shoe form, pushed as a modal from Manage Shoes
  screens/              actual screen implementations (testable, UI logic lives here)
  components/           shared UI: ShoeCard, SizeSelector, OrdersTable, QuantityStepper,
                         CartBanner (global floating "view cart" pill), ConfirmDialog, ...
  store/                Redux Toolkit slices + redux-persist setup
    slices/
      authSlice.ts        accounts + the signed-in user id, seeded with demo Admin/User accounts
      shoesSlice.ts       catalog CRUD, seeded with sample shoes
      cartSlice.ts        cart line items
      ordersSlice.ts       placed orders (denormalized line items + the placing user's id, so
                           editing/deleting a shoe or account later doesn't change historical
                           order records)
  types/                 shared TypeScript types (Shoe, CartItem, Order, AuthUser, ...)
```

### Key decisions

- **State management: Redux Toolkit + redux-persist.** The brief allowed AsyncStorage directly or
  a backend of choice; Redux Toolkit was chosen to keep cart/catalog/order logic in small, testable
  reducers rather than scattering `AsyncStorage.getItem`/`setItem` calls through components.
- **UI library: [React Native Paper](https://callstack.github.io/react-native-paper/).** The brief
  suggested Material UI components; Paper is the React Native equivalent (Material Design 3),
  giving consistent, accessible components (cards, chips, text fields, a data table) across iOS,
  Android, and web with minimal custom styling.
- **Local accounts, not a real auth system.** The brief explicitly said no APIs were required, but
  asked for separate Admin/User functionality, so login/signup is real (real form validation, real
  per-account role and order history) while stopping short of a backend: passwords are SHA-256
  hashed (`src/utils/hash.ts`, via `expo-crypto`) and compared entirely on-device — there's no
  server to verify against. Route access is gated with expo-router's `Stack.Protected`, so the
  tabs/modals and the login/signup screens are mutually exclusive based on session state. See
  [IMPROVEMENTS.md](IMPROVEMENTS.md) for what a server-backed version would add.
- **Orders table is responsive, not just scrollable.** `OrdersTable` renders a proper
  `DataTable` on wide/web viewports and switches to a stacked card layout on narrow screens,
  rather than shrinking a table until it's unreadable on a phone.
- **Shoe images are optional and local-only.** Admin can attach a photo via `expo-image-picker`;
  it's stored as a local file URI. This is a known limitation for a real product — see
  IMPROVEMENTS.md.
- **A global cart banner, not just a Cart tab.** `CartBanner` is mounted once in the root layout
  (outside the tab navigator) so it floats above every screen — Shop, a shoe's detail modal,
  Orders, Profile — whenever the signed-in user has items in their cart, and hides itself on the
  Cart screen to avoid being redundant there.
- **Confirmations use a Paper `Dialog`, not `Alert.alert`.** React Native's `Alert.alert` is a
  no-op on `react-native-web` — it renders nothing in the browser build. Every confirm/destructive
  action (log out, reset app data, delete a shoe, the image-permission notice) goes through a
  shared `ConfirmDialog` component (`src/components/ConfirmDialog.tsx`, built on Paper's
  `Portal`/`Dialog`) so it works identically on iOS, Android, and web.

## Known simplifications

- Accounts are local to the device/browser and passwords are verified on-device (see "Local
  accounts, not a real auth system" above) — there's no server, so this isn't real security.
- Sign-up always creates a "User" account; the single Admin account is seeded with its demo
  credentials shown on the login screen, rather than built as a self-service role anyone can pick.
- Shoe photos are local file URIs (picked from the device), not uploaded anywhere — they won't
  survive a reinstall or sync across devices.
- Payment is out of scope per the brief; "Place Order" clears the cart and records the order
  immediately.
- The 5 seeded catalog photos (`assets/images/shoes/`) are placeholder product shots used for
  the demo, kept separate from Redux state (see `src/constants/seedShoeImages.ts`) rather than
  persisted — swap them for licensed/original photography before using this beyond a demo.

See [APPROACH.md](APPROACH.md) for how this was built and problems hit along the way, and
[IMPROVEMENTS.md](IMPROVEMENTS.md) for what would change with more time.
