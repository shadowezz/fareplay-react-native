# FarePlay

![FarePlay Logo](fareplay_logo.png)

This repository contains work for our FarePlay mobile app, the cutting-edge ride hailing aggregator that simplifies the process of finding the best ride-hailing options for your destination. With FarePlay, users can easily compare prices and select the most suitable ride-hailing application based on their preferences and budget.

## Usage

Download the `.apk`, open and install the application. You will be required to grant location access for the app to work.

Once you are logged in, simply key in your start and end destinations to start viewing the various ride prices! You can also head over to your profile page which should show your name (only name was obtainable via Singpass as of this time) and you can also change the app language!

## Features

- **Map View:** FarePlay provides users with an intuitive map interface that displays various ride-hailing options available for a specific destination. The map view allows users to explore different options and choose the most convenient one.

- **Price Comparison:** FarePlay aggregates and presents real-time price information from multiple ride-hailing applications, enabling users to compare fares and make informed decisions. The platform ensures transparency and helps users find the most affordable options.

- **Booking Integration:** Once users have selected their preferred ride-hailing service, FarePlay seamlessly redirects them to the respective app, where they can complete the booking process without any hassle.

- **Post-COVID Landscape** A future extension includes integrating safety protocols into the application. Providing information about driver hygiene practices, vehicle sanitization measures, and compliance with local health guidelines can instill confidence in users and help them make informed decisions.

## Requirements
- React-Native
- Expo

## Installation

To setup development for the mobile app, follow these steps:

1. Clone the FarePlay repository to your local machine:
   ```bash
   git clone todo: update git link
   ```

2. Install the necessary dependencies:
   ```bash
   cd todo: update directory
   npm install
   ```

3. Follow the `.env.example` template to create a `.env` file with the corresponding config parameters. All the same parameters will also need to be set within `app.config.js` and `eas.json` to facilitating building the app via expo. Note that you will also require a `GOOGLE_API_KEY` to enable the map features.

4. Once all the installations and configurations are done, you will need to have a physical device or emulator ready to run the app. Assuming you are working with an android device, execute the following command:
   ```bash
   expo start --android
   ```

