const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const dayjs = require('dayjs')

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = '../token.json';

// Load client secrets from a local file.
fs.readFile('../credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Calendar API.
  authorize(JSON.parse(content), listEvents);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  calendar.events.list({
    calendarId: 'miamioh.edu_iqfdjm4hl7778006cj6vd1m47s@group.calendar.google.com',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        const start = dayjs(event.start.dateTime) || dayjs(event.start.date);

        const summary = event.summary;
        console.log(summary);
        console.log(start);

        const folder = `events/${start.format(`YYYY/MMMM/DD`)}/${formatSummary(summary)}`
        const tempPath = `../generated/temp/`;
        const path = `../generated/${folder}/`;
        const scorePath = `../generated/${folder}/images/scores/`;

        console.log(path);

        if (!fs.existsSync(tempPath)){
          fs.mkdirSync(tempPath, { recursive: true });
        }

        if (!fs.existsSync(scorePath)){
          fs.mkdirSync(scorePath, { recursive: true });
        }
      });
    } else {
      console.log('No upcoming events found.');
    }
  });
}

function parseSummary(summary) {
  const split = summary.split(' ');
  const result = {};

  for (let i = 0; i < split.length; i++) {
    if (i === 0) {
      result.teamAbv = split[i];
    } else if (split[i].includes('vs') && split[i + 1] !== undefined && !split[i + 1].includes('@') ) {
      result.enemyAbv = split[i + 1]
    } else if (split[i].includes('@')) {
      result.tournamentAbv = split[i].replace(/^@+/, "");
    }
  };

  return result;
}

function formatSummary(summary) {
  const split = parseSummary(summary);
  console.log(split);
  let result = '';

  if (split.teamAbv !== undefined) {
    result += split.teamAbv;
  }

  if (split.enemyAbv !== undefined) {
    result += `vs${split.enemyAbv}`;
  }

  if (split.tournamentAbv !== undefined) {
    result += `@${split.tournamentAbv}`;
  }

  return result;
}