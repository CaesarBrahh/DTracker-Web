# Sunlight

Front-end only IU tracker. sun.caesarbrahh.dev

## How Sunlight Absorption is Calculated

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

Cloud coverage is to not at all deterministic in the slightest. The user has the choice between 4 options, but true conditions vary much more grandly than these 4 options, making it undeterministic, but good enough. 

* Clear sky = 1.0
* Scattered clouds = 0.75
* Broken clouds = 0.5
* Overcast = 0.25

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

The program stops counting IU's past 15,000 IUs in a single day since the body reaches a photostationary state at that state to prevent vitamin D toxicity.

## Architecture

### File Layout
```
sun/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js          # page events + main app flow
│   ├── location.js     # gets GPS coordinates
│   ├── weather.js      # fetches UVI/cloud data
│   ├── calculator.js   # IU/min formula
│   ├── timer.js        # stopwatch/session tracking
│   └── constants.js    # convert age value into its proper factor
└── readme.md
```

### Program Flow

1. User clicks "Start Sun Session"

2. Collect user inputs:
    - Age
    - Fitzpatrick Type
    - Cloud Coverage
    - Skin Exposure

3. Convert values into model factors:
    - `user_inputs["age"]`
    - `user_inputs["fitzpatrick"]`
    - `user_inputs["clouds"]`
    - `user_inputs["skin"]`

4. Browser requests user's GPS location to get:
    - lattitude
    - longitude

--------------------------------------------------------

3. Weather API is called to fetch:
    - current UVI
    - hourly UVI forecast

6. Calculate IU/min

7. Start stopwatch

8. Every second:
    - elapsed time is updated,
    - IU gained is added to total IU

9. Every minute:
    - IU/min is recalculated

10. Stopwatch stops at 15,000 IU

## Future Improvements

Definitely will make the layout way less crude and more user friendly. The inital development as of now is simply for me, so I'm not too worried about design, but implementing some css and some explanations about the factors wouldn't hurt.

I plan on turning this into a full-fledged iOS application in the near-future. 

I'm looking into utilizing the iPhone's camera to capture a LUX score as an alternative to "Cloud Coverage," providing a more factor!

In addition,Vitamin D absorption isn't a linear model as it tends to form an <I>aympotatic</i> curve. I wanted to get this site out asap, so I kept the linear model, but will definitely implement a more accurate formulation in the near-future!
