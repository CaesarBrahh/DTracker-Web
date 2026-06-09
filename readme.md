# DTracker-Web

DTracker is a web application that estimates vitamin D production from sunlight exposure in real time. Users provide their age, Fitzpatrick skin type, and skin exposure, while the application automatically retrieves local UV Index and cloud coverage data using the browser’s GPS location. During a sunbathing session, DTracker continuously estimates IU production, updates UV intensity throughout the day, and tracks cumulative vitamin D gained over time.

![Demo](media/IMG_3650.GIF)

## Features

* Real-time UV Index and Cloud Coverage retrieval based on GPS location
* Fitzpatrick skin type and skin exposure adjustments
* Age-based vitamin D production scaling
* Live IU/min estimation
* Session timer with cumulative IU tracking
* Frontend-only architecture (no backend required)

## Tech Stack

* HTML
* CSS
* Javascript (ES Modules)

### APIs

* Open-Meteo Forecast API
* Browser Geolocation API

## Architecture

DTracker is implemented as a fully client-side web application. All calculations, location retrieval, API requests, and session tracking are performed directly in the browser through JavaScript ES Modules, eliminating the need for a backend server or database. The codebase follows a module design in which each file has a single responsibility with `app.js` orchestrating the overall flow and `timer.js` maintaining the session timing.

### Project Structure
```
.
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js          # page events + main app flow
│   ├── location.js     # gets GPS coordinates
│   ├── weather.js      # fetches UVI data
│   ├── timer.js        # session tracking
│   └── constants.js    # convert age value into its proper factor
└── readme.md
```

### Program Flow
```
┌──────────┐                                                       
│index.html│                                                       
└──────────┘
   ├── user inputs age, Fitzpatrick skin type, and skin exposure
   ▼
┌──────┐                                                       
│app.js│                                                       
└──────┘
   ├── user inputs are stored
   │
   ├── location.js
   │      └── browser Geolocation API → latitude/longitude
   │
   ├── weather.js
   │      └── `Open-Meteo API → hourly UVI and cloud coverage forecast
   │
   ▼
┌────────┐                                                          
│timer.js│                                                          
└────────┘                                                    
   ├── calculates average IUs per minute                              
   │                                                                  
   ├── pulls HTML elements                                            
   │                                                                  
   ├── increments total IUs by average IUs per minute ◀─┐
   │                                                    │
   ├── updates HTML elements                            │×1000ms
   │                                                    │
   ├── if 5 minutes have passed, recalculates IU/min ───┘
   │
   ▼
┌─────────────┐
│Program exits│ if total IUs > 15000 or UVI < 3
└─────────────┘
```

## The Math Behind It All

Given a collection of factors, this program determines how many IUs/min you are receiving. Then a stopwatch begins running incrementing your total IUs based off total time accrued on the stopwatch. 

### Factors

* Age (A)
* Fitzpatrick Score (F)
* UV Index (UVI)
* Cloud Coverage (C)
* Skin Exposed (S)

```
IU/min ≈ ((100×UVI×C)/F) × A × S
```

#### Baseline Calibration (100)

The "100" serves as the mathematical scaling constant to convert the factors and constants into standards IUs.

To establish this constant of 100, I followed the Webb & Engelsen core benchmarks. The conditions within their environmental reference found that s young adult (A=1.0) with Fitzpatrick Type II skin (F=1.4) exposing his arms, hands, and face (S=0.3) in clear-sky UV 3.5 weather (UVI=3.5) would generate 1000 IUs in 13 min.

```
UI/min = ((K×UVI×C)/F) × A × S

K = (F×IU) / (min×UVI×C×A×S)

K = (1.4×1000) / (13×3.5×1.0×1.0×0.3)

K = 102.56
```

#### Cloud Coverage Coefficient (C)

Cloud coverage data is pulled from the Open-Meteo API. For each hour, we're given a percent value of total cloud coverage from 0-100, with 0% being clear skies, and 100% being complete overcast. 

It'd be simple to then map that factor as such:
```
0%   -> 1.00
25%  -> 0.75
50%  -> 0.50
75%  -> 0.25
100% -> 0.00
```
but in reality even 100% of overcast skies still let a surprising amount of UV through!

A more realistic conversion would be:
```
C = 1 - 0.75 * (cloudCover / 100);
```
which gives:
```
0%   -> 1.00
25%  -> 0.8125
50%  -> 0.625
75%  -> 0.4375
100% -> 0.25
```

<u>Note</u>: the 25% floor is just a modeling choice, not a physical law.

#### Age Coefficient (A)

* Ages 18-49 = 1.0
* Ages 50-69 = 0.75
* Ages 70+ = 0.5

#### Skin Exposure Factor (S)

* Long Sleeves + Pants = 0.1
* Short Sleeves + Pants = 0.3
* Short Sleeves + Shorts = 0.5
* Shirtless + Shorts = 0.8
* Bikini = 0.9
* Nude = 1.0

#### Fitzpatrick Factor (F)

* Type 1 = 1.6
* Type 2 = 1.4
* Type 3 = 1.2
* Type 4 = 1.0
* Type 5 = 0.8
* Type 6 = 0.6

### Max Intake

The program stops counting IU's past 15,000 IUs in a single day mimicing how the body reaches a photostationary state at 10-15k IUs in order to vitamin D toxicity.

### Minimum UVI

Vitamin D synthesis only occurs when UVI >= 3.

## Future Improvements

- pause/play functionality.

- Vitamin D absorption isn't a linear model as it tends to form an <I>aympotatic</i> curve.

- iOS application 

- iPhone camera LUX score for cloud coverage
