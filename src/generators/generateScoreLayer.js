const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  async generateScoreLayer (path, tempPath, width, height, maxScore, logoWidth, logoXOffset) {
    const gothamMedium = "pt Gotham Medium";
    const scoreWeight = 212;

    const matchGraphic = await loadImage(`${tempPath}/scores.png`)
    for (i = 0; i <= maxScore; i++) {
      for (j = 0; j <= maxScore; j++) {
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(matchGraphic, 0, 0, width, height);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#fff';
      
        ctx.font = scoreWeight + gothamMedium;

        ctx.fillText(i, logoXOffset + (logoWidth / 2), 225);
        ctx.fillText(j, (width - logoXOffset - (logoWidth / 2)), 225);

        const buffer = canvas.toBuffer('image/png');

        fs.writeFile(`${path}thumbnail${i}to${j}.png`, buffer, (error) => {
          if (error) { console.log("Error writing thumbnail to file"); }
        });
      }
    }

    return new Promise(resolve => {
      setTimeout(() => {
        resolve('Successfully finalized scores');
      }, 2000);
    });
  }
}