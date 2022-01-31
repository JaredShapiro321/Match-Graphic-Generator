const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  async generateForegroundLayer (path, tempPath, width, height, teamTitle, enemyTitle, logoWidth, logoXOffset, currentDate) {
    const gothamBlack = "pt Gotham Narrow Black";
    const teamWeight = 28;
    const month = "JANUARY";
    const monthWeight = 19;
    const date = "25";
    const dateWeight = 74;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const foreground = await loadImage('../resources/images/match-graphic-foreground.png')
    ctx.drawImage(foreground, 0, 0, width, height);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#fff';
  
    ctx.font = teamWeight + gothamBlack;
    ctx.fillText(teamTitle, logoXOffset + (logoWidth / 2), 25);
    ctx.fillText(enemyTitle, (width - logoXOffset - (logoWidth / 2)), 25);
    ctx.font = monthWeight + gothamBlack;
    ctx.fillText(month, width / 2, 25);
    ctx.font = dateWeight + gothamBlack;
    ctx.fillText(date, width / 2, 45);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFile(`${tempPath}foreground.png`, buffer, (error) => {
      if (error) { 
        console.log('Could not draw foreground:', error)
      }
    });

    return new Promise(resolve => {
      setTimeout(() => {
        resolve('Successfully generated foreground');
      }, 2000);
    });
  }
}
