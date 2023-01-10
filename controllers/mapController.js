const { spawn, spawnSync, exec } = require('child_process');
const Jimp = require('jimp');
const imageModel = require('../models/imageModel');
var ip = require('ip');
const rosnodejs = require('rosnodejs');

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
        if (existingImage) {
          console.log('Image URL already exists in the database');
          res.status(200).json({
            Message: 'Image URL already exists in the database',
            link: imageURL,
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
        });
      }
    );
  } catch (err) {
    res.status(200).json({ err });
    console.log(err);
  }
};

exports.startMap = async (req, res) => {
  try {
    // start map
    child = spawn('roslaunch', ['mir_navigation', 'start_mapping.launch'], {
      shell: true,
      detached: true,
    });
    console.log(`Started roslaunch with PID: ${child.pid}`);
    latestValue = child;
    res.status(200).json({
      Message: `Services started successfully`,
    });
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
    const nodesToKill = nodes.filter((node) =>
      node.startsWith('/hector_mapping')
    );
    if (nodesToKill.length) {
      // Kill the nodes
      spawn('rosnode', ['kill', ...nodesToKill], {
        shell: true,
      });
    }
    res.status(200).json({
      Message: `nodes have been killed successfully`,
    });
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
        '~/catkin_ws/src/mir_robot/mir_gazebo/maps/my_map.yaml',
      ],
      { shell: true }
    );
    res.status(200).json({
      status: 'success',
      message: 'map_server executed successfully',
    });
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
    await rosnodejs.initNode(process.env.ROSNODE);
    const nh = rosnodejs.nh;
    const client = nh.serviceClient(
      process.env.PauseMapSrvName,
      process.env.PauseMapSrvType
    );
    data = req.body.data;
    client.call({ data: data });
    res.status(200).json({
      status: 'success',
      data,
    });
    console.log('Service call successfull');
  } catch (err) {
    console.log('Error while calling the service: ', err);
  }
};
exports.downloadMap = (req, res) => {
  res.download('images/map.jpg');
};