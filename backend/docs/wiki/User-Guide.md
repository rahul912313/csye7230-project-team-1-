# User Guide

This guide explains how to use QuickRent as a regular user — from signing up to completing a booking.

---

## 1. Creating an Account

1. Navigate to `http://localhost:3000`
2. You will see the GoHaul landing page — click **Sign Up** in the top right corner

![Landing Page](screenshots/landing-hero.png)
*Figure 1: GoHaul landing page*

3. Fill in the registration form:
   - **Select Role** — choose User
   - **Full Name**
   - **Email Address**
   - **Password** (minimum 6 characters)
   - **Driver's License Number** (alphanumeric, 6–15 characters)
4. Click **Create Account**

![Sign Up Page](screenshots/signup.png)
*Figure 2: Create an Account form*

---

## 2. Logging In

1. Click **Login** in the navigation bar
2. Select **User** as your role
3. Enter your **email** and **password**
4. Click **Log In**

![Login Page](screenshots/login.png)
*Figure 3: Login page with role selection*

After login you will be redirected to the home dashboard with a personalized greeting.

![Home Dashboard](screenshots/home-dashboard.png)
*Figure 4: Home dashboard after login*

---

## 3. Browsing Vehicles

### Browse by List
1. Click **Vehicles** in the navigation bar
2. You will see all available vehicles with photos, type, daily price, and location
3. Use the **date pickers** to filter by availability
4. Use the **type filters** (All, Sedan, Cargo Van, Moving Truck, Large Truck) to narrow results
5. Click **View Details & Book** on any vehicle

![Vehicle Listing](screenshots/vehicles.png)
*Figure 5: Available Vehicles page with date picker and type filters*

### Browse by Map
1. Click **Map Search** in the navigation bar
2. The map search header shows total vehicles available and search radius

![Map Search](screenshots/map-search.png)
*Figure 6: Map Search — Find Vehicles Near You*

3. Click **Use My Location** or search by city/ZIP
4. An interactive Leaflet map shows all vehicles as markers
5. Click any marker to see vehicle details — capacity, price, location
6. Click **View Details & Book** to proceed

![Map View](screenshots/map-view.png)
*Figure 7: Interactive map with vehicle popup showing details*

---

## 4. Booking a Vehicle

QuickRent uses a **two-phase booking system** to prevent double-bookings.

### Phase 1 — View Details & Request a Quote

1. Click **View Details & Book** from the vehicle list or map
2. The vehicle detail page shows full specs — price, capacity, license plate, location, availability status
3. Click **Book This Vehicle**

![Vehicle Detail](screenshots/vehicle-detail.png)
*Figure 8: Vehicle detail page*

4. Select your **start date** and **end date**
5. A quote modal appears showing:
   - Vehicle name, rental period, price per day
   - **Total price** calculated automatically
   - **Quote valid for 14 minutes** — the vehicle is held during this window
6. Click **Confirm & Proceed to Payment** or **Change Dates** if needed

![Quote Modal](screenshots/quote-modal.png)
*Figure 9: Review Your Quote modal with 14-minute hold timer*

### Phase 2 — Complete Payment

1. The Stripe payment modal appears showing the total amount
2. Choose your payment method — **Card** or **Cash App Pay**

![Payment Modal](screenshots/payment-modal.png)
*Figure 10: Secure Payment modal powered by Stripe*

3. Enter your card details:
   - Card number, expiration date, CVC, ZIP code
   - For test payments use card number: `4242 4242 4242 4242`
4. Click **Pay**
5. Your booking is confirmed and will appear in My Bookings

![Card Entry](screenshots/card-entry.png)
*Figure 11: Stripe card entry form*

---

## 5. Managing Your Bookings

### My Bookings
1. Click **My Bookings** in the navigation bar
2. You will see a summary: Total Bookings, Active, Confirmed, Pending
3. Each booking shows Booking ID, start/end dates, vehicle, and status (Confirmed / Pending / Canceled)

![My Bookings](screenshots/my-bookings.png)
*Figure 12: My Bookings dashboard showing booking history and status*

### Transaction History
1. Click **Transactions** in the navigation bar
2. View all payment records with amount, payment method, status, and booking ID
3. Click **Export** to download your transaction history

![Transactions](screenshots/transactions.png)
*Figure 13: Transaction History page with payment records*

---

## 6. Using the AI Chatbot

QuickRent includes an AI-powered chatbot for instant support:

1. Click the **blue chat icon** in the bottom-right corner of any page
2. Type your question, for example:
   - "How do I book a vehicle?"
   - "What is the cancellation policy?"
   - "How much does an SUV cost per day?"
3. The chatbot responds instantly with relevant information about QuickRent

---

## 7. Updating Your Profile

1. Click the **profile icon** (top right) in the navigation bar
2. Update your name, email, or password
3. Click **Save Changes**
