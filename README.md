
# IMDB Scraper
This repository contains two Node.js scripts that scrape movie data from the IMDB 100 Movies You Should Watch Before You Die! list page.

## Installation
Before running the scripts, install the required dependencies:

    npm install

Code 1: Cheerio Scraper
The first script (cheerio_scraper.js) uses Cheerio and Axios to fetch the HTML content of the IMDB page, parse it, and extract the desired movie information.

## Usage
Run the Cheerio scraper:

    node cheerio_scraper.js

This script will create a result.json file containing an array of movie objects with the following properties:

 - title: Movie title 
 - score: Metascore 
 - time: Runtime picture 
 - URL: Image source URL

## Code 2: Puppeteer Scraper
The second script (puppeteer_scraper.js) uses Puppeteer to launch a headless browser, navigate to the IMDB page, scroll down to load all the movie entries, and extract the desired movie information.

##  Usage
Run the Puppeteer scraper:

    node puppeteer_scraper.js

This script will create a result2.json file containing an array of movie objects with the following properties:

 1. title: Movie title 
 2. score: Metascore time: 
 3. Runtime picture
 4. URL: Image source URL

In addition, this script will download the movie posters and save them as .jpg files in the current directory, using the movie title and index as the file name.
