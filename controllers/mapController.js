const { spawn, spawnSync, exec } = require('child_process');
const Jimp = require('jimp');
const imageModel = require('../models/imageModel');
var ip = require('ip');
const rosnodejs = require('rosnodejs');
const SetBool = rosnodejs.require('std_srvs').srv.SetBool;
const fs = require('fs');
var mapState = 'unactive';
spawn('rosrun', ['map_server', 'map_server', process.env.MAP_PATH]);
// console.log(process.env.MAP_PATH);

exports.getMap = async (req, res, next) => {
  try {
    // Initialize the ROS node
    await rosnodejs.initNode(process.env.ROSNODE);
    const nh = rosnodejs.nh;

    // Subscribe to the map topic and process the incoming message
    const sub = nh.subscribe(
      process.env.MapTopic,
      process.env.MapTopicType,
      async (msg) => {
        // Convert the occupancy grid message into an image
        const width = msg.info.width;
        const height = msg.info.height;
        const image = new Jimp(width, height);
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const index = y * width + x;
            const value = msg.data[index];
            const invertedValue = value === 0 ? 255 : 0;
            image.setPixelColor(
              Jimp.rgbaToInt(invertedValue, invertedValue, invertedValue, 255),
              x,
              y
            );
          }
        }
        image.rotate(180);
        image.mirror(true, false);
        image.write(`images/map.jpg`);
        nh.unsubscribe('/map');

        // Generate the image URL and check if it already exists in the database
        const ipAddress = ip.address();
        const imageURL = `${req.protocol}://${ipAddress}:5050/map.jpg`;
        const existingImage = await imageModel.findOne({ link: imageURL });
        const imageData = fs.readFileSync('images/map.jpg');
        const base64Image = imageData.toString('base64');
        // console.log(base64Image);
        // fs.writeFileSync('images/base64.txt', base64Image);
        if (existingImage) {
          console.log('Image URL already exists in the database');
          res.status(200).json({
            Message: 'Image URL already exists in the database',
            link: imageURL,
            base64: `data:image/jpeg;base64,${base64Image}`,
          });
          return;
        }

        // If the image URL does not exist in the database, save the new image
        const newPicture = new imageModel({
          path: 'images/map.jpg',
          type: 'map',
          Date: Date.now(),
          link: imageURL,
        });
        await newPicture.save();

        // Return the response to the client
        // const object = {
        //   Status: 'success',
        //   Message: 'Image has been sent uploaded successfully',
        //   link: imageURL,
        // };
        res.status(200).json({
          Status: 'success',
          Message: 'Image has been sent uploaded successfully',
          link: imageURL,
          base64: `data:image/jpeg;base64,${base64Image}`,
        });
      }
    );
    mapState = 'gettingMap';
  } catch (err) {
    res.status(200).json({ err });
    console.log(err);
  }
};

exports.startMap = async (req, res) => {
  try {
    const output = spawnSync('rosnode', ['list']);
    const nodes = output.stdout.toString().split('\n');
    // console.log(nodes);
    const nodesToKill = nodes.filter((node) => node.startsWith('/map_server'));
    console.log(nodesToKill);
    if (nodesToKill.length) {
      spawn('rosnode', ['kill', ...nodesToKill]);
    }
    let width = Number(req.body.width);
    let height = Number(req.body.height);
    let resolution = Number(req.body.resolution);
    console.log(`width : ${width} h: ${height} r: ${resolution}`);
    let max = width > height ? width : height;
    // console.log(max);
    let mapCommand = `map_size:=${max / resolution}`;
    // console.log(mapCommand);
    let resolutionCommand = `map_resolution:=${resolution}`;
    // console.log(resolutionCommand);

    // start map
    child = spawn(
      'roslaunch',
      [
        'mir_navigation',
        'hector_mapping.launch',
        mapCommand,
        resolutionCommand,
      ],
      {
        shell: true,
        detached: true,
      }
    );
    console.log(`Started roslaunch with PID: ${child.pid}`);
    latestValue = child;
    res.status(200).json({
      Message: `Services started successfully`,
    });
    mapState = 'startingMap';
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
exports.stopMap = async (req, res) => {
  try {
    // Find the name of the nodes that were created by the roslaunch command
    const output = spawnSync('rosnode', ['list']);
    const nodes = output.stdout.toString().split('\n');
    const nodesToKill = nodes.filter(
      (node) => node.startsWith('/hector_mapping')
      // node.startsWith('/rviz') ||
      // node.startsWith('/rqt_robot_steering')
    );
    if (nodesToKill.length) {
      // Kill the nodes
      spawn('rosnode', ['kill', ...nodesToKill], {
        shell: true,
      });
      // spawn('killall', ['gzserver', 'gzclient'], {
      //   shell: true,
      // });
      spawn(
        'rosrun',
        [
          // '-e',
          // 'rosrun',
          'map_server',
          'map_server',
          process.env.MAP_PATH,
        ],
        { shell: true }
      );
    }
    res.status(200).json({
      Message: `nodes have been killed successfully`,
    });
    mapState = 'mapStoped';
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
    });
  }
};

exports.saveMap = async (req, res) => {
  try {
    //Commmand rosrun map_server map_saver -f my_map.yaml
    const child = spawn(
      'rosrun',
      [
        'map_server',
        'map_saver',
        '-f',
        '~/catkin_ws/src/mir_robot/mir_gazebo/maps/my_map',
      ],
      { shell: true }
    );
    res.status(200).json({
      status: 'success',
      message: 'map_server executed successfully',
    });
    mapState = 'saved';
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error running map_server command',
    });
  }
};

exports.pauseMap = async (req, res) => {
  try {
    const stat = req.body.stat;
    await rosnodejs.initNode(process.env.ROSNODE);
    const nh = rosnodejs.nh;
    const client = await nh.serviceClient(
      process.env.PauseMapSrvName,
      process.env.PauseMapSrvType
    );
    const requestPause = new SetBool.Request();
    if (stat === 'true') {
      requestPause.data = true;
      await client.call(requestPause);
      mapState = 'paused';
    }
    if (stat === 'false') {
      requestPause.data = false;
      await client.call(requestPause);
      mapState = 'resumed';
    }
    console.log(requestPause);
    res.status(200).json({
      status: 'success',
      data: requestPause.data,
    });
    console.log('Service call successfull');
  } catch (err) {
    console.log('Error while calling the service: ', err);
  }
};

exports.downloadMap = (req, res) => {
  res.download('images/map.jpg');
  mapState = 'MapDownloaded';
};
exports.mapStatus = (req, res) => {
  try {
    res.status(200).json({
      mapState,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err,
    });
  }
};
exports.mapUpdate = async (req, res) => {
  try {
    spawnSync(
      'cp',
      [
        // '-e',
        // 'cp',
        '-r',
        '~/catkin_ws/src/js_pkg/upload/map.jpg',
        '~/catkin_ws/src/mir_robot/mir_gazebo/maps/',
      ],
      { shell: true }
    );
    spawn('rosrun', ['map_server', 'map_server', process.env.MAP_PATH], {
      shell: true,
    });
    mapState = 'MapUpdated';
    console.log('updated');
    // res.status(200).json({
    //   message: 'refreshed',
    // });
    console.log('mapUpdated');
  } catch (err) {
    console.log(err);
    res.status(200).json({
      err,
    });
  }
};
exports.mapConvert = async (req, res) => {
  try {
    const base64Data = req.body.imageBase64.replace(
      /^data:image\/[a-z]+;base64,/,
      ''
    );
    console.log('endpoint triggered');

    const imageType = req.body.imageBase64.match(
      /^data:image\/([a-z]+);base64,/
    )[1];
    const filePath = `./images/convertedImage.${imageType}`;

    fs.writeFile(filePath, base64Data, 'base64', (err) => {
      if (err) {
        return res.status(500).send({ error: err });
      }

      res.status(200).send({ message: 'Image saved successfully' });
    });
  } catch (err) {
    console.log(err);
  }
};
