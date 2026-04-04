# Admin Guide

This guide explains how to use QuickRent as an administrator.

---

## 1. Admin Login

1. Navigate to `http://localhost:3002/admin/login` (or click Admin on the login page)
2. Select **Admin** as your role
3. Enter your **admin email** and **password**
4. Click **Log In**
5. You will be redirected to the **Admin Dashboard**

---

## 2. Admin Dashboard Overview

The admin dashboard provides a complete overview of platform activity:
- **Total Users** registered on the platform
- **Active Vehicles** currently in the fleet
- **This Month** — bookings made this month
- **Revenue** — total revenue generated

![Admin Dashboard](screenshots/admin-dashboard.png)
*Figure 14: Admin Dashboard showing key platform metrics*

Scrolling down shows a **Bookings Trend** line chart (last 7 days activity), **Fleet Distribution** pie chart (vehicles by type), and **Booking Status** pie chart (Confirmed / Pending / Canceled breakdown).

![Admin Analytics Charts](screenshots/admin-analytics-charts.png)
*Figure 15: Fleet Distribution and Booking Status charts*

Further down shows the **Revenue by Vehicle Type** bar chart and a **Recent Bookings** list.

![Admin Revenue Chart](screenshots/admin-revenue-chart.png)
*Figure 16: Revenue by Vehicle Type and Recent Bookings*

---

## 3. Managing Vehicles

1. Click **Vehicles** in the left sidebar
2. The Vehicle Management page shows all vehicles with model, type, capacity, price/day, license plate, status, and actions

![Vehicle Management](screenshots/admin-vehicles.png)
*Figure 17: Vehicle Management page with full fleet listing*

### Adding a New Vehicle
1. Click **+ Add Vehicle** (top right)
2. Fill in vehicle details — model, type, capacity, daily rate, license plate, location, images
3. Click **Save**

### Deleting a Vehicle
1. Find the vehicle in the list
2. Click the **Delete** button in the Actions column
3. Confirm the deletion

---

## 4. Managing Bookings

1. Click **Bookings** in the left sidebar
2. The Booking Management page shows all bookings across all users
3. Each row shows Booking ID, User ID, Vehicle ID, Start/End Date, Status, and Actions
4. Use the **Filter by status** dropdown to filter by Pending, Confirmed, or Canceled
5. Click **View Details** to see full booking information
6. Click **Cancel** to cancel a pending booking

![Booking Management](screenshots/admin-bookings.png)
*Figure 18: Admin Booking Management with full booking list and cancel actions*

---

## 5. Managing Users

1. Click **Users** in the left sidebar
2. View all registered users
3. Click any user to view their profile and booking history

---

## 6. Viewing Analytics

All analytics are visible on the **Overview** dashboard:

| Chart | Description |
|---|---|
| Bookings Trend | Line chart — bookings per day over last 7 days |
| Fleet Distribution | Pie chart — vehicles by type (Sedan, SUV, Truck, etc.) |
| Booking Status | Pie chart — Confirmed vs Pending vs Canceled |
| Revenue by Vehicle Type | Bar chart — income breakdown per vehicle type |
| Recent Bookings | List of the 5 most recent bookings with status |

---

## 7. Notifications

QuickRent sends automated notifications via Firebase:
- **Booking Confirmation** — sent to user when payment completes
- **Booking Cancellation** — sent to user when booking is canceled
- **New Booking Alert** — sent to admin when a new booking is made
