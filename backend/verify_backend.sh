#!/bin/bash

BASE_URL="http://localhost:5001/api"

echo "1. Registering Hospital Manager..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@hospital.com",
    "password": "password123",
    "role": "HOSPITAL",
    "fullName": "Dr. House",
    "phone": "1234567890",
    "hospitalName": "Princeton Plainsboro",
    "address": "123 Main St",
    "city": "Princeton",
    "latitude": 40.343,
    "longitude": -74.655
  }')

echo "Register Response: $REGISTER_RESPONSE"

TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Registration failed or token not found."
  # Try login if already registered
  echo "Attempting login..."
  LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "manager@hospital.com",
      "password": "password123"
    }')
  echo "Login Response: $LOGIN_RESPONSE"
  TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
fi

if [ -z "$TOKEN" ]; then
  echo "Login failed. Exiting."
  exit 1
fi

echo "Token: $TOKEN"

echo "2. Updating Inventory..."
INVENTORY_RESPONSE=$(curl -s -X PATCH $BASE_URL/hospital/inventory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "bedsGeneral": 10,
    "bedsICU": 5,
    "bedsOxygen": 20,
    "doctorsActive": 3
  }')

echo "Inventory Response: $INVENTORY_RESPONSE"

echo "3. Getting Bookings..."
BOOKINGS_RESPONSE=$(curl -s -X GET $BASE_URL/hospital/bookings \
  -H "Authorization: Bearer $TOKEN")

echo "Bookings Response: $BOOKINGS_RESPONSE"
