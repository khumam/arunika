# Arunika
Arunika is the K6 prebuilt script to do the integration test from json file. So you don't need to create one by one test script in Javascript. That's take a lot of time my brother! Start build the json file then run it with K6.

## Before you start the test
Make sure you have installed the K6. For anyone who don't know about how to install K6, check their [official documentation](https://k6.io/docs/get-started/installation/)

## The json structure
I'm working on the documentation, for now, you can check the `example/dummy.json` as an guide. The point is, you just need to fill what inside the `dummy.json` with your own needs.

## How to run it
If you have done the json file, run it by this command
```
k6 run -e SCENARIO_PATH=path/to/your.json run.js
```
or if you want to add more log, just add `--http-debug="full"` after the `run.js`, so it become
```
k6 run -e SCENARIO_PATH=path/to/your.json run.js --http-debug="full"
```
or if you want to use the `run.sh` you can use
```
./run.sh path/to/your.json
```