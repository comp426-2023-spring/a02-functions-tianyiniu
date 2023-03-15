#!/usr/bin/env node

import minimist from "minimist";
import moment from "moment-timezone";
import fetch from "node-fetch";

const args = minimist(process.argv.slice(2));

const help_str = `Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE\n \
    -h            Show this help message and exit.\n \
    -n, -s        Latitude: N positive; S negative.\n \
    -e, -w        Longitude: E positive; W negative.\n \
    -z            Time zone: uses tz.guess() from moment-timezone by default.\n \
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.\n \
    -j            Echo pretty JSON from open-meteo API and exit.`

const help = args.h;
const timezone = args.z || moment.tz.guess();
const lat = args.n || args.s * -1;
const lg = args.e || args.w * -1;
const json = args.j;
var day;
if (args.d === undefined) {
	day = 1;
} else if (args.d === 0) {
	day = 0;
} else {
	day = args.d;
}

const URL = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lg + '&daily=precipitation_hours&current_weather=true&timezone=' + timezone;
const response = await fetch(URL);
const data = await response.json();

function weather(data) {
	var date_log;
	if (day == 0) {
		date_log = " today.";
	} else if (day == 1) {
		date_log = " tomorrow.";
	} else {
		date_log = ` in ${day} days.`;
	}

	const precip = data.daily.precipitation_hours;	
	if (precip[day] >= 1) {
		console.log("You might need your galoshes" + date_log);
	} else {
		console.log("You will not need your galoshes" + date_log);
	}
}

if (help) {
	console.log(help_str);
	process.exit(0);
} else if (json) {
	console.log(data);
	process.exit(0);
} else {
	weather(data);
}
