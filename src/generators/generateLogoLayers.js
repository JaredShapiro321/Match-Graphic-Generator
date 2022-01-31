const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  async generateLogoLayers (path, tempPath, width, height, logoWidth, logoXOffset, logoYOffset) {
    await generateLogos(path, tempPath, width, height, logoWidth, logoXOffset, logoYOffset);
    await finalizeScoreLogos(path, tempPath, width, height);
  }
}

async function generateLogos (path, tempPath, width, height, logoWidth, logoXOffset, logoYOffset) {
  const miamiColor = "#C41230";
  const enemyColor = "#FFC423"; 

  const logoCanvas = createCanvas(width, height);
  const scoreCanvas = createCanvas(width, height);
  const logoCtx = logoCanvas.getContext('2d');
  const scoreCtx = scoreCanvas.getContext('2d');
  
  const miamiLogo = await loadImage('../resources/images/miami-logo.png')
  const miamiLogoHeight = logoWidth * (miamiLogo.height / miamiLogo.width);
  
  const enemyLogo = await loadImage('../resources/images/enemy-logo.png')
  const enemyLogoHeight = logoWidth * (enemyLogo.height / enemyLogo.width);
  const enemyLogoYOffset = logoYOffset + ((miamiLogoHeight - enemyLogoHeight) / 2);

  logoCtx.drawImage(enemyLogo, (width - logoXOffset - logoWidth), enemyLogoYOffset, logoWidth, enemyLogoHeight);
  logoCtx.drawImage(miamiLogo, logoXOffset, logoYOffset, logoWidth, miamiLogoHeight);
  scoreCtx.drawImage(enemyLogo, (width - logoXOffset - logoWidth), enemyLogoYOffset, logoWidth, enemyLogoHeight);
  scoreCtx.drawImage(miamiLogo, logoXOffset, logoYOffset, logoWidth, miamiLogoHeight);
  scoreCtx.globalCompositeOperation = 'multiply';
  scoreCtx.fillStyle = miamiColor;
  scoreCtx.fillRect(0, 0, width / 2, height);
  scoreCtx.fillStyle = enemyColor;
  scoreCtx.fillRect(width / 2, 0, width, height);
  scoreCtx.globalCompositeOperation = 'source-over';

  const logosBuffer = logoCanvas.toBuffer('image/png');
  await fs.writeFile(`${tempPath}logos.png`, logosBuffer, (error) => {
    if (error) { 
      console.error('Could not draw foreground:', error) 
    }
  })

  const scoreBuffer = scoreCanvas.toBuffer('image/png');
  await fs.writeFile(`${tempPath}color-logos.png`, scoreBuffer, (error) => {
    if (error) { 
      console.error('Could not draw foreground:', error) 
    }
  })

  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Successfully generated logos');
    }, 2000);
  });
}

async function finalizeScoreLogos (path, tempPath, width, height) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const scoreLogos = await loadImage(`${tempPath}color-logos.png`);
  const logos = await loadImage(`${tempPath}logos.png`);

  
  
  ctx.drawImage(logos, 0, 0, width, height);
  ctx.globalCompositeOperation = 'source-in';
  ctx.drawImage(scoreLogos, 0, 0, width, height);

  const buffer = canvas.toBuffer('image/png');
  await fs.writeFileSync(`${tempPath}score-logos.png`, buffer, (error) => {
    if (error) { console.error('Could not draw foreground:', error) }
  });

  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Successfully finalized scores');
    }, 2000);
  });
}