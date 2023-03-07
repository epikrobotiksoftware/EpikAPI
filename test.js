// const Jimp = require('jimp');

// Jimp.read('./images/map.jpg').then((image) => {
//   image.quality(60).greyscale().write('./images/image.pgm');
// });

/////////////////////////////////////////////////////////////////////////////
// const fs = require('fs');
// const Jimp = require('jimp');
// const inputPath = './images/map.jpg';
// const outputPath = './images/newMap.pgm';
// async function savePGM(inputPath, outputPath) {
//   const image = await Jimp.read(inputPath);

//   const width = image.bitmap.width;
//   const height = image.bitmap.height;

//   let data = 'P2\n';
//   data += `${width} ${height}\n`;
//   data += '255\n';

//   for (let y = 0; y < height; y++) {
//     for (let x = 0; x < width; x++) {
//       const color = Jimp.intToRGBA(image.getPixelColor(x, y));
//       const intensity = Math.round(
//         0.2989 * color.r + 0.587 * color.g + 0.114 * color.b
//       );
//       data += `${intensity} `;
//     }
//     data += '\n';
//   }

//   fs.writeFileSync(outputPath, data);
// }

// savePGM('./images/map.jpg', './images/newMap.pgm');

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// const fs = require('fs');

// Read the file
// fs.readFile(
//   '/home/kali/catkin_ws/src/mir_robot/mir_gazebo/maps/my_map.yaml',
//   'utf8',
//   (err, data) => {
//     if (err) throw err;

//     // Replace the text
//     let newData = data.replace(
//       '/home/kali/catkin_ws/src/mir_robot/mir_gazebo/maps/my_map.pgm',
//       '/home/kali/catkin_ws/src/mir_robot/mir_gazebo/maps/map.pgm'
//     );

//     // Write the file
//     fs.writeFile(
//       '/home/kali/catkin_ws/src/mir_robot/mir_gazebo/maps/my_map.yaml',

//       newData,
//       (err) => {
//         if (err) throw err;
//         console.log('File updated');
//       }
//     );
//   }
// );
/////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////
//Rotate Image from backend

// const Jimp = require('jimp');

// // Load the image
// Jimp.read('images/map.jpg')
//   .then((image) => {
//     let degreesToRotate = 90;

//     // Convert negative degrees to positive
//     while (degreesToRotate < 0) {
//       degreesToRotate += 360;
//     }

//     // Rotate the image
//     image.rotate(degreesToRotate);

//     // Save the rotated image
//     return image.writeAsync('images/map.jpg');
//   })
//   .catch((error) => {
//     console.error(error);
//   });

const sharp = require('sharp');
const fs = require('fs');

// Read the PNG image from file
sharp('images/convertedImage.png')
  .grayscale()
  .raw()
  .toBuffer((err, data, info) => {
    if (err) throw err;

    // Create a new PGM image with the same dimensions
    const pgm = `P5\n${info.width} ${info.height}\n255\n`;

    // Write the PGM image to file
    const stream = fs.createWriteStream('images/my_map.pgm');
    stream.write(pgm);
    stream.write(data);
    stream.end();
  });
