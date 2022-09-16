# Air-Quality

Api For Air Quality Index

documentation can be found here [***here***](https://documenter.getpostman.com/view/19129990/2s7YfPeDyj)

>### Setting Up
>
> 1. make sure you have *yarn* installed
> 2. pull repostitry with *git pull https://github.com/hephhay/Air-Quality/*
> 3. run *yarn init*
> 4. then run *yarn install*
> 5. create *.env* file and set the follow valriables
>   - MONGO_URI= *{your full mongo db uri}*
>   - IQAIR_SECRET_KEY=*{ secret key from https://www.iqair.com/}*
>   - SECRET= *{any secure string}*
>   - AIR_VISUAL=*{https://api.airvisual.com/v2/nearest_city}*
>   - TEST_LAT= *{any random latitude eg. '35.696233'}*
>   - TEST_LON=*{any random longitude eg. '139.570431'}*
> 6. run *yarn build* to compile to js
> 7. run *yarn tests* to run all tests
> 8. run *yarn start* to start the project
