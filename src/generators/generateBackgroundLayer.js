const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  async generateBackgroundLayer(path, tempPath, width, height, teamColor, enemyColor) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const background = await loadImage('../resources/images/match-graphic-background.png');
    ctx.drawImage(background, 0, 0, width, height);

    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = teamColor;
    ctx.fillRect(0, 0, width / 2, height);
    ctx.fillStyle = enemyColor;
    ctx.fillRect(width / 2, 0, width, height);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFile(`${tempPath}background.png`, buffer, (error) => {
      if (error) { 
        console.error('Could not draw foreground:', error) 
      }
    });

    return new Promise(resolve => {
      setTimeout(() => {
        resolve('Successfully generated background');
      }, 2000);
    });
  }
}