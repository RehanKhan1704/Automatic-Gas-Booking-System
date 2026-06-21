# Smart Gas Booking and Safety System

## Abstract

The Smart Gas Booking and Safety System using IoT is designed to enhance convenience and safety in LPG usage. This system automates gas cylinder booking by monitoring gas levels using weight sensors and sending alerts via a mobile app when refilling is needed. Additionally, it includes a gas leakage detection module that triggers an alarm and automatically shuts off the gas supply while notifying users via SMS or app notifications. The integration of IoT ensures real-time monitoring, improving safety and efficiency in household and commercial gas usage.

## Project Members

1. SHAIKH SAAD AYAZ  – **Team Leader**
2. KHAN REHAN MAJIBULLAH
3. SAYED TALHA IFTEKHAR
4. KHAN MOHD SAIF ABDUL MUNAF

## Project Guide

- PROF. MOHD ASHFAQUE SHAIKH – **Primary Guide**

## Deployment Steps

Please follow the below steps to run this project:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/RehanKhan1704/Automatic-Gas-Booking-System.git
   cd Automatic-Gas-Booking-System
2. **Install Dependencies and Run the Application Make sure you have Node.js and npm installed.**
   ```bash
      cd frontend
      npm create vite@latest . -- --template react
      npm install
      npm run dev  # runs on http://localhost:5173

   Use one backend :
    backend-node(Mongodb):
      cd backend-node
      npm install
      npm run dev
    backend-python(in-memory db)
      pip install -r requirement.txt
      python app.py
   
## Subject Details
Class: TE (COMP) Div A - 2024-2025

Subject: Mini Project: 2A (MP2A(P)(2019))

Project Type: Mini Project

## Platform, Libraries and Frameworks Used
    Node.js
    
    Express.js
    
    MongoDB
    
    Firebase (for app notifications)
    
    Twilio API (for SMS alerts)
    
## IoT Components:
    
    Load Cell with HX711
    
    MQ-2 Gas Sensor
    
    NodeMCU ESP8266

## References
    
    IJERT – Smart LPG Monitoring
    
    IJPRSE – IoT LPG Booking and Leak Detection
    
    JES – IoT Customer Service and Alarm System
