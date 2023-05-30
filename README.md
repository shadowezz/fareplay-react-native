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

## Building

Building the `.apk` involves a series of detailed steps. We built our app on an Ubuntu OS and thus the steps below may have to be modified accordingly. This section also assumes that the installation steps above have been completed.

1. If you have not done so, ensure your `.env`, `app.config.js` and `eas.json` files are configured for production.
2. Download android sdk here with wget (https://developer.android.com/studio).
3. Unzip and move the downloaded folder to `/usr/lib/android-sdk`.
4. Create a new directory called `latest` inside this downloaded folder then copy all its contents into the newly created `latest` folder.
5. Next, run the following command (note that command needs to be run on every new terminal session!):
   ```bash
   export ANDROID_HOME="/usr/lib/android-sdk"
   ```
6. Head into `/usr/lib/android-sdk/build_tools` and delete all folders other than debian (address the inconsistent location issue) - may not be necessary, ignore if you do not run into errors.
7. Head into `/usr/lib/android-sdk/cmdline-tools/latest/bin` and type:
   ```bash
   sudo ./sdkmanager --licenses
   ```
8. Accept all licenses.
9. Within the project directory, run:
   ```bash
   expo eject
   ```
10. Next, make `/usr/lib/android-sdk` writable by running:
      ```bash
      sudo chmod -R a+rw /usr/lib/android-sdk
      ```
11. Then, run: 
      ```bash
      expo prebuild --npm --clean
      ```
12. Finally, begin your local build with:
      ```bash
      eas build -p android --profile production --local
      ```