const fs = require('fs');
const { createCanvas, loadImage, registerFont } = require('canvas');
const { generateBackgroundLayer } = require('./generateBackgroundLayer.js');
const { generateForegroundLayer } = require('./generateForegroundLayer.js')
const { generateLogoLayers } = require('./generateLogoLayers.js')
const { generateScoreLayer } = require('./generateScoreLayer.js')
generate();

async function generate() {
  const width = 1200;
  const height = 675;

  const gothamBlack = "pt Gotham Narrow Black";
  const gothamMedium = "pt Gotham Medium";
  const tachyon = "pt Tachyon Regular"

  const teamName = "Miami University";
  const teamAbv = "MU";
  const enemyName = "Northern Kentucky University";
  const enemyAbv = "NKU";

  const teamTitle = 'MIAMI UNIVERSITY';
  const enemyTitle = "N. KENTUCKY UNI.";
  const teamColor = "#C41230";
  const enemyColor = "#FFC423";

  const logoWidth = 365;
  const logoXOffset = 60;
  const logoYOffset = 170;
  const maxScore = 3;


  registerFont('../resources/fonts/GOTHAM/GOTHAMNARROW-BLACK.OTF', { family: 'Gotham Narrow', style: 'Black' })
  registerFont('../resources/fonts/GOTHAM/GOTHAM-MEDIUM.OTF', { family: 'Gotham', style: 'Medium' })

  const currentDate = new Date();

  const folder = `${currentDate.getMonth() + 1}-${currentDate.getDate()}-${currentDate.getFullYear()}/${teamAbv}vs${enemyAbv}`
  const tempPath = `../../generated/temp/`;
  const path = `../../generated/${folder}/`;
  const scorePath = `../../generated/${folder}/scores/`;

  console.log(path);

  if (!fs.existsSync(tempPath)){
    fs.mkdirSync(tempPath, { recursive: true });
  }

  if (!fs.existsSync(scorePath)){
    fs.mkdirSync(scorePath, { recursive: true });
  }

  await generateBackgroundLayer(path, tempPath, width, height, teamColor, enemyColor);
  await generateForegroundLayer(path, tempPath, width, height, teamTitle, enemyTitle, logoWidth, logoXOffset);
  await generateLogoLayers(path, tempPath, width, height, logoWidth, logoXOffset, logoYOffset);

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const canvas2 = createCanvas(width, height);
  const ctx2 = canvas2.getContext('2d');

  const background = await loadImage('../../generated/temp/background.png');
  const logos = await loadImage('../../generated/temp/logos.png');
  const logosScore = await loadImage('../../generated/temp/score-logos.png');
  const foreground = await loadImage('../../generated/temp/foreground.png');

  ctx.drawImage(background, 0, 0, width, height);
  ctx2.drawImage(background, 0, 0, width, height);
  ctx.drawImage(logosScore, 0, 0, width, height);
  ctx2.drawImage(logos, 0, 0, width, height);
  ctx.drawImage(foreground, 0, 0, width, height);
  ctx2.drawImage(foreground, 0, 0, width, height);

  const scoresBuffer = canvas.toBuffer('image/png');
  const thumbnailBuffer = canvas2.toBuffer('image/png');


  fs.writeFileSync('../../generated/temp/scores.png', scoresBuffer);
  fs.writeFileSync(`../../generated/${folder}/thumbnail.png`, thumbnailBuffer);

  await generateScoreLayer(path + 'scores/', tempPath, width, height, maxScore, logoWidth, logoXOffset);
}