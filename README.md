# ZeroWasteTable - Project Instructions

## Project Overview
ZeroWasteTable is a food donation and sharing platform built to connect Restaurants with surplus food to NGOs. The system tracks food listings, donation requests, and overall impact metrics (like CO2 saved and people fed). It utilizes geospatial data (latitude/longitude) to facilitate local matches.

## Tech Stack
- **Backend Framework**: Python with Flask.
- **Database**: SQLite (`database.db`) using SQLAlchemy ORM.
- **Frontend**: HTML templates (using Jinja2), Vanilla JavaScript, and standard CSS.
- **Security**: `werkzeug.security` for password hashing.

## Directory Structure & Conventions
- `app.py`: The main Flask application and routing entry point.
- `instance/`: Contains the SQLite database (`database.db`).
- `templates/`: Contains all HTML templates, structurally separated by role:
  - `admin/`: Admin-related views.
  - `auth/`: Login and registration flows for all roles.
  - `ngo/`: NGO-specific dashboards and views.
  - `restaurant/`: Restaurant-specific dashboards and listing management.
  - *Note:* CSS and JS files are currently located in `templates/css/` and `templates/js/`. When updating frontend assets, respect this existing structure rather than assuming a standard Flask `static/` folder unless refactoring is requested.

## Database Schema & Entities
- **User**: General authentication model (`user_id`, `name`, `email`, `password`, `phone`, `role`, `is_verified`).
- **Restaurant**: Details for food donors (`restaurant_id`, `restaurant_name`, `address`, `fssai_license`, `latitude`, `longitude`, etc.).
- **NGO**: Details for food receivers (`ngo_id`, `ngo_name`, `registration_no`, `capacity`, `latitude`, `longitude`, etc.).
- **FoodListing**: Created by Restaurants to offer food (`listing_id`, `restaurant_id`, `food_name`, `quantity`, `expires_at`, `status`).
- **DonationRequest**: Created by NGOs to claim a listing (`request_id`, `listing_id`, `ngo_id`, `status`).
- **Donation**: Completed donations tracking impact (`donation_id`, `request_id`, `people_fed`, `co2_saved_kg`).

## Achieve
1. **Consistency**: Always align new code with the existing Flask/SQLAlchemy patterns found in `app.py`.
2. **Frontend Styling**: Stick to Vanilla JS and CSS. Do not introduce external libraries (like React or Tailwind) without explicit user permission.
3. **Roles & Access**: Ensure proper session and role validation (Admin, NGO, Restaurant) when creating or modifying routes.
4. **Safety**: Never log or expose the `app.secret_key` or user passwords in plain text. Use `werkzeug.security` for all password handling.
