# Google Analytics Events Documentation

This document outlines the Google Analytics 4 (GA4) event tracking implementation for the Calm Rest Hotel Management System frontend.

## Implementation Overview
- **Library:** `react-ga4`
- **Methodology:** A mix of GA4 Standard E-commerce events and custom engagement events.
- **Section Tracking:** Utilizes a custom `useSectionTracking` hook (IntersectionObserver) to fire events when specific UI sections reach 50% visibility.

---

## Global Events

| Event Name | Trigger | Parameters |
| :--- | :--- | :--- |
| `page_view` | Automatically tracked on route change (in `App.tsx`). | `page_path` |
| `nav_click` | Clicking any link in the Navbar. | `link_name`, `target_url` |
| `cta_click` | Clicking primary call-to-action buttons (e.g., "Book Now"). | `button_name`, `target_url`, `room_name` (if applicable) |
| `section_view` | When a tracked section becomes 50% visible. | `section_name`, `page_path` |

---

## Page-Specific Events

### 1. Home Page (`Home.tsx`)
- **Sections Tracked (`section_view`):**
    - `Hero`
    - `About Teaser`
    - `Featured Rooms`
    - `Services`
    - `Testimonials Teaser`
- **Interactions:**
    - `cta_click`: "Hero Book Now", "Hero Learn More", "About Learn More", "View All Rooms", "Home Read More Reviews".

### 2. Rooms Page (`Rooms.tsx`)
- **E-commerce:**
    - `view_item_list`: Triggered when the room list is successfully fetched.
        - Parameters: `item_list_name: "Main Rooms Page"`, `items: [...]`
- **Sections Tracked (`section_view`):**
    - `Room Categories Filter`
    - `Rooms Grid`
- **Interactions:**
    - `filter_rooms`: Triggered when a category filter is clicked.
        - Parameters: `category_name`
    - `cta_click`: "Room Card Book Now", "Room Card Details".

### 3. Room Details Page (`RoomDetails.tsx`)
- **E-commerce:**
    - `view_item`: Triggered when specific room data is loaded.
        - Parameters: `currency: "USD"`, `value`, `items: [...]`
- **Interactions:**
    - `cta_click`: "Room Details Book".

### 4. Booking Form (`BookingForm.tsx`)
- **E-commerce:**
    - `begin_checkout`: Triggered when the "Book Now" button is clicked (form submission start).
        - Parameters: `value`, `currency`, `items`
    - `purchase`: Triggered upon successful booking confirmation.
        - Parameters: `transaction_id`, `value`, `currency`, `items`

### 5. Authentication (`Login.tsx`, `Register.tsx`)
- **`login`**: Successful login.
    - Parameters: `method` ("email" or "google")
- **`sign_up`**: Successful account registration.
    - Parameters: `method` ("email")

### 6. Contact & Reviews (`Contact.tsx`, `WriteReview.tsx`)
- **`generate_lead`**: Successful Contact Form submission.
    - Parameters: `form_type: "contact"`
- **`submit_review`**: Successful Testimonial submission.
    - Parameters: `room_type`, `rating`

### 7. Location (`Location.tsx`)
- **`view_map`**: Clicking the "Open in Google Maps" button.
    - Parameters: `map_service: "google_maps"`

---

## Technical Utility
Events are dispatched via `frontend/src/utils/analytics.ts`:
- `trackEvent(name, params)`: For custom/engagement events.
- `trackEcommerceEvent(name, items, params)`: For GA4 standard e-commerce schemas.


gemini --resume "28880ac6-d03a-4194-87eb-bf35ec6af79e"
