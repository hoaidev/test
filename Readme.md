# Description
This is project used for Manu Agent

# Structure
-- manu-agent -> root
    - clients -> Angular7 module(front-end)
    - controllers -> server side Controllers
    - models -> server side Models
    - public -> used for serve html
    - routes -> server side Routing
    - app.js -> NodeJS application
    - package.json -> Depenedencies Management

# How to use
1. Client Implementation
    - Put Angular code into folder 'client'
    - Run app: [ng serve] -> application will be hosted on localhost:4200
    - Build app: [ng build] -> build html/css/js to 'public' folder for server side rendering
2. Server Implementation
    - Put logic code into exact folder
    - Run server: [npm start] -> application will be hosted on localhost:5555
3. Dependencies installing
    - Run: [npm install] -> dependencies will be installed automatically