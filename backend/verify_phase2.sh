#!/bin/bash

# ======================================================
# MedQueue Phase 2: Patient Search & Booking Verification
# Derived from: "MedQueue – Smart Emergency Routing System"
# ======================================================

BASE_URL="http://localhost:5001/api"
echo "🏥 Starting MedQueue Phase-2 System Test..."
echo "------------------------------------------------------"

# ======================================================
# TEST 1: Geolocation Search (GET /api/hospitals)
# According to Blueprint:
# - Accepts ?lat & ?lng
# - Returns verified hospitals
# - Sorted by viability score (distance + beds)
# ======================================================

echo "📡 Test 1: Fetching nearest hospitals..."
LAT=28.6139
LNG=77.2090

SEARCH_RESPONSE=$(curl -s -X GET "$BASE_URL/hospitals?lat=$LAT&lng=$LNG")

# Basic validation for JSON & hospital array
if [[ $SEARCH_RESPONSE != *"["* ]]; then
  echo "❌ ERROR: Expected hospital list array."
  echo "Server Response:"
  echo "$SEARCH_RESPONSE"
  exit 1
fi

echo "✅ Hospitals fetched successfully."

# Extract verified hospital ID
HOSPITAL_ID=$(echo "$SEARCH_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [[ -z "$HOSPITAL_ID" ]]; then
  echo "⚠️ No verified hospitals found. Add at least one verified hospital."
  exit 1
fi

echo "   -> Selected Hospital ID: $HOSPITAL_ID"
echo "------------------------------------------------------"


# ======================================================
# TEST 2: Booking Creation (POST /api/bookings)
# From Blueprint:
# Payload fields:
#   patientName
#   condition
#   severity ("LOW"|"MODERATE"|"CRITICAL")
#   userId (PATIENT user)
#   hospitalId
#
# Booking status default = "INCOMING"
# ======================================================

echo "🚑 Test 2: Creating emergency booking..."

BOOKING_RESPONSE=$(curl -s -X POST "$BASE_URL/bookings" \
  -H "Content-Type: application/json" \
  -d "{
    \"patientName\": \"Rahul Verma\",
    \"condition\": \"Chest Pain\",
    \"severity\": \"CRITICAL\",
    \"userId\": 1,
    \"hospitalId\": $HOSPITAL_ID
  }")

# Validate success
if [[ $BOOKING_RESPONSE != *"id"* ]]; then
  echo "❌ Booking creation failed."
  echo "Server Response:"
  echo "$BOOKING_RESPONSE"
  exit 1
fi

echo "✅ Booking successfully created!"
echo "   Server Response: $BOOKING_RESPONSE"
echo "------------------------------------------------------"


# ======================================================
# TEST 3: Hospital Manager Fetches Incoming Patients
# GET /api/hospital/bookings
# Should return all bookings with status = INCOMING
# ======================================================

echo "📥 Test 3: Checking hospital incoming queue..."

INCOMING_RESPONSE=$(curl -s -X GET "$BASE_URL/hospital/bookings?hId=$HOSPITAL_ID")

if [[ $INCOMING_RESPONSE != *"INCOMING"* ]]; then
  echo "❌ ERROR: Booking not visible in hospital incoming list."
  echo "Server Response:"
  echo "$INCOMING_RESPONSE"
  exit 1
fi

echo "✅ Hospital incoming queue updated correctly."
echo "------------------------------------------------------"


# ======================================================
# TEST 4 (Optional but Important):
# PATCH /api/bookings/:id/status
# Update booking flow → ADMITTED
# ======================================================

BOOKING_ID=$(echo "$BOOKING_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

echo "🩺 Test 4: Updating booking status to ADMITTED..."

STATUS_RESPONSE=$(curl -s -X PATCH "$BASE_URL/bookings/$BOOKING_ID/status" \
  -H "Content-Type: application/json" \
  -d "{\"status\": \"ADMITTED\"}")

if [[ $STATUS_RESPONSE != *"ADMITTED"* ]]; then
  echo "❌ ERROR: Failed to update booking status."
  echo "Server Response:"
  echo "$STATUS_RESPONSE"
  exit 1
fi

echo "✅ Booking marked as ADMITTED successfully."
echo "------------------------------------------------------"

echo "🎉 Phase-2 Validation Completed Successfully!"
echo "MedQueue Patient Flow System is working as per Blueprint."
