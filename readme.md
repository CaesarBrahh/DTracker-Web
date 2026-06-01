# Sunlight

The old app I used to use to track my sunlight IU intake no longer works, so I scrapped together this version quickly as an alternative. I plan to make a full-fledged iOS app in the future though. This version is just to tie me over!

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

Cloud coverage is to not at all deterministic in the slightest and the user has full control over what they think the cloud coverage is, but here's a general reference.

* Clear sky = 1.0
* Scattered clouds = 0.7-0.9
* Broken clouds = 0.3-0.6
* Overcast = 0.1-0.2

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
* Nude = 1

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


## Future Improvements

I plan on turning this into a full-fledged iOS application in the near-future. 

I'm looking into utilizing the iPhone's camera to capture a LUX score as an alternative to "Cloud Coverage," providing a more factor!

In addition,Vitamin D absorption isn't a linear model as it tends to form an <I>aympotatic</i> curve. I wanted to get this site out asap, so I kept the linear model, but will definitely implement a more accurate formulation in the near-future!
