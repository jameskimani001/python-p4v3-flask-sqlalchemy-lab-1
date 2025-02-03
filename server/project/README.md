# Food Waste Management Platform

## Overview

The Food Waste Management Platform is a web application designed to manage food donations. Users can add, edit, delete, and claim donations. The platform also allows users to track the status of their donations (available, claimed, picked up) and view the history of donations.

## Problem Statement

Food waste is a significant issue, with edible food often discarded. A system is needed to redistribute food to those in need, helping reduce food waste and support communities.

## Solution

The Food Waste Management Platform connects donors with charities and community members in need, allowing users to donate surplus food and ensure it reaches the right people.

## Features

- **Add Donation**: Users can add new donations by providing details such as name, description, quantity, and location.
- **Edit Donation**: Users can edit existing donations.
- **Delete Donation**: Users can delete donations.
- **Claim Donation**: Users can claim available donations.
- **Track Donation Status**: Users can track the status of their donations (available, claimed, picked up).
- **View Donation History**: Users can view the history of all donations.
- **User Authentication**: Users can log in and their actions are tracked.

## User Stories

- **User Registration**: As a user, I want to register on the platform so that I can donate food.
- **Login**: As a user, I want to log in to my account to manage my donations.
- **Create Donation**: As a user, I want to create a donation listing for food I no longer need.
- **Browse Donations**: As a user, I want to browse available donations to find food that I can pick up.
- **Claim Donation**: As a user, I want to claim a food donation so that I can pick it up.
- **View Donation History**: As a user, I want to view my past donations and claims.
- **Track Donation Status**: As a user, I want to track the status of my donation (pending, claimed, picked up).
- **Update Donation Info**: As a user, I want to edit the details of my donation listing if needed.
- **Delete Donation**: As a user, I want to delete a donation listing if it is no longer available.
- **Search for Donations**: As a user, I want to search for donations based on location and type of food.

## Models

- **User**: 
  - `user_id` (PK)
  - `name`
  - `email` (unique)
  - `password`
  - `role` (donor/recipient)
  - `is_verified`
- **Donation**: 
  - `donation_id` (PK)
  - `user` (ForeignKey to User)
  - `food_type`
  - `description`
  - `status`
- **Claim**: 
  - `claim_id` (PK)
  - `user` (ForeignKey to User)
  - `donation` (ForeignKey to Donation)
  - `claimed_date`

## Technologies Used

- **React**: Frontend library for building user interfaces.
- **TypeScript**: Superset of JavaScript that adds static typing.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **React Hot Toast**: Library for displaying notifications.
- **Local Storage**: Browser storage for persisting data.
- **Flask**: Backend framework for building the API.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- Python and pip installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:jameskimani001/Food-Waste-Management-Platform.git
   cd Food-Waste-Management-Platform