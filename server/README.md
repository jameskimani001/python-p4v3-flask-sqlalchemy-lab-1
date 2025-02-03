## Name JAMES KIMANI
## DATE 1 FEB 2025
## Food Waste Management Platform

## Overview

The Food Waste Management Platform is a web application designed to streamline the process of managing food donations. It allows users to add, edit, delete, and claim donations, while also providing functionality to track the status of donations (available, claimed, picked up). Users can easily view their donation history, making it easier to donate or receive food in a responsible manner.

## SOLUTION
This platform is a solution to minimize food waste by connecting individuals, organizations, and communities to donate excess food to those in need.

## Features

Add Donation: Users can easily add a new food donation by providing essential details such as name, description, quantity, and location.
Edit Donation: Users have the ability to modify an existing donation's details, such as updating the quantity or description.
Delete Donation: Donations can be deleted from the platform when no longer needed.
Claim Donation: Users can claim available donations and express interest in picking them up.
Track Donation Status: Users can see whether donations are still available, claimed, or picked up.
View Donation History: Users can keep track of their donation history for future reference.
User Authentication: Secure login and tracking of user actions to ensure a personalized experience.
Technologies Used
React: A powerful JavaScript library for building dynamic user interfaces.
TypeScript: Adds type safety to JavaScript, enhancing code quality and maintainability.
Tailwind CSS: A utility-first CSS framework for styling the app’s interface with ease and flexibility.
React Hot Toast: A library for displaying toast notifications that notify users of key actions and updates.
Local Storage: Used for persistent storage to keep user data even after a page refresh.
Getting Started
Prerequisites
Before you begin, ensure you have the following software installed on your local machine:

Node.js and npm (Node Package Manager)
If you don’t have them installed, visit the official Node.js website to get the latest version.

Installation
Clone the repository:

bash
Copy
git clone git@github.com:jameskimani001/Food-Waste-Management-Platform.git
Navigate into the project directory:

bash
Copy
cd Food-Waste-Management-Platform
Install the required dependencies:

bash
Copy
npm install
Start the development server:

bash
Copy
npm start
Open your browser and navigate to http://localhost:3000.

Usage
Adding a Donation
Fill in the required fields: Name, Description, Quantity, and Location.
Click the "Add Donation" button to submit your donation.
Editing a Donation
Navigate to the donation you wish to update.
Click the "Edit" button on the donation card.
Modify the details of the donation as needed.
Click the "Update Donation" button to save your changes.
Deleting a Donation
Click the "Delete" button on the donation card of the item you wish to remove.
Confirm your action to permanently delete the donation.
Claiming a Donation
Click the "Claim" button on an available donation card to express interest in the donation.
The donation status will update to "Claimed," and you can proceed to arrange pickup.
Marking a Donation as Picked Up
After claiming a donation, you can mark it as "Picked Up" by clicking the corresponding button.
Viewing Donation History
Access the donation history by clicking the "View Donation History" button in the navigation bar. This will display all your previous donations, whether given or claimed.
## Deployment
Deploying to Netlify
To deploy your React app to Netlify, follow these steps:

Build the React app for production:

 ## npm run build
Log in to Netlify and create a new site:

Go to Netlify and log in or sign up.
Click New Site from Git and select your Git provider (GitHub, GitLab, or Bitbucket).
Choose the repository for your project.
Configure the build settings:

Branch to deploy: main (or whichever branch you prefer to deploy)
Build command: npm run build
Publish directory: build
Click Deploy Site, and Netlify will begin the deployment process.

Once the deployment is complete, you will be given a live URL to access your site.

Code Structure
src/components/Donations.tsx
This component handles the main donation functionality, such as adding, editing, deleting, and claiming donations. It also includes:

State Management: Tracks the state of donations, new donation form, and user interactions.
Local Storage Persistence: Ensures donation data persists even if the page is reloaded.
Event Handlers: Includes functions for handling user actions (e.g., adding or updating donations).
Rendering: Dynamically displays the donation cards and manages updates to the UI.
## Contributing
We welcome contributions! If you'd like to improve the platform, please follow these steps:

Fork the repository.
Create a new branch for your changes.
Implement your changes and test them locally.
Submit a pull request with a clear description of your changes.
## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contact
For any questions or inquiries, feel free to reach out via email: jameskim092t@gmail.com

## Demo
https://app.screencastify.com/v2/manage/videos/6jxhKAvUl2gfC3H0rZJT


## Repository
https://github.com/jameskimani001/Food-Waste-Management-Platform

## WELL CONDED WITH LOVE AND PASSION
