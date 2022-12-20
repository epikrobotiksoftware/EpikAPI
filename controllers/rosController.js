const rosnodejs = require('rosnodejs');
const { EventEmitter } = require('stream');
const robot_msgs = rosnodejs.require('robot').msg;
const Jimp = require('jimp');
const imageModel = require('../models/imageModel');
var ip = require('ip');

//listening  to the robotState topic
var lastestStatusMsg = {};
var saveMapObject;
rosnodejs.initNode('/my_node').then(() => {
  const nh = rosnodejs.nh;
  const sub = nh.subscribe('/robot_state', 'robot/RobotState', (msg) => {
    // console.log(msg);
    lastestStatusMsg = msg;
  });
});

var counter = 0;
exports.listenCommand = (req, res) => {
  console.log('My values');
  console.log(req.body.param);
  console.log(req.body.val);
  const { stringify } = require('querystring');

  rosnodejs
    .initNode('/my_node')
    .then(() => {
      const nh = rosnodejs.nh;
      const arslan = nh.setParam(String(req.body.param), req.body.val);
      arslan.then((result) => {
        console.log(result);
      });
      /////Subscriber and publisher//////////////
      const sub = nh.subscribe('/arslanTopic', 'std_msgs/String', (msg) => {
        console.log('Got msg on chatter: %j', msg);
      });

      const pub = nh.advertise('/arslanTopic', 'std_msgs/String');
      pub.publish(String(req.body.msg));

      res.status(200).json({
        status: 'success',
        data: {
          arslan: req.body,
        },
      });
    })
    .catch((err) => {
      rosnodejs.log.error(err.stack);
    });
};

exports.joystick = (req, res) => {
  const start = Date.now();
  rosnodejs.initNode('/my_node').then(() => {
    const endTime = Date.now();
    // console.log('Node Difference', endTime-start);
    const nh = rosnodejs.nh;
    const beforeAdvertise = Date.now();
    const pub = nh.advertise('/cmd_vel', 'geometry_msgs/Twist');
    const afterAdvertise = Date.now();
    // console.log('Advetise Difference', afterAdvertise-beforeAdvertise );

    // while(true){
    setTimeout(function () {
      pub.publish({
        linear: {
          x: req.body.x,
          y: 0,
          z: 0,
        },
        angular: {
          x: 0,
          y: 0,
          z: req.body.z,
        },
      });
      counter++;
      console.log('Counter', counter, req.body);
      res.status(200).json({
        status: 'success',
        data: req.body,
      });
      EventEmitter.setMaxListeners(1000);
    }, 10);
    // }
    // console.log(pub)
  });
};

exports.batteryStatus = (req, res) => {
  var percent = lastestStatusMsg.battery_percentege;

  try {
    // console.log(lastestStatusMsg);
    // globalVar = 5;
    res.status(201).json({
      status: 'success',
      Battery: percent,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'fail',
      data: {
        err,
      },
    });
  }
};

exports.robotStatus = (req, res) => {
  try {
    // console.log(lastestStatusMsg);
    // globalVar = 5;
    res.status(201).json({
      status: 'success',
      data: lastestStatusMsg,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.saveMap = async (req, res, next) => {
  rosnodejs
    .initNode('/my_node')
    .then(() => {
      const nh = rosnodejs.nh;
      const sub = nh.subscribe(
        '/map',
        'nav_msgs/OccupancyGrid',
        async (msg) => {
          const width = msg.info.width;
          const height = msg.info.height;
          const image = new Jimp(width, height);
          var invertedValue = null;

          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const index = y * width + x;
              const value = msg.data[index];
              if (value === 0) {
                invertedValue = 255;
              } else {
                invertedValue = 0;
              }

              image.setPixelColor(
                Jimp.rgbaToInt(
                  invertedValue,
                  invertedValue,
                  invertedValue,
                  255
                ),
                x,
                y
              );
            }
          }
          image.rotate(180);
          image.mirror(true, false);
          image.write(`images/map.jpg`);
          const ipAddress = ip.address();
          var ImageURL = `${req.protocol}://${ipAddress}:5050/map.jpg`;
          const newPicture = new imageModel({
            path: 'images/map.jpg',
            type: 'map',
            Date: Date.now(),
            link: ImageURL,
          });
          var object = {
            Message: 'Image has been sent uploaded successfully',
            link: ImageURL,
          };
          saveMapObject = object;
          await newPicture
            .save()
            .then((doc) => {
              //   console.log('doc saved successfully', doc);

              next();
            })
            .catch((err) => {
              console.log(err);
            });
        }
      );
    })
    .catch((err) => {
      res.status(200).json({
        err,
      });
      console.log(err);
    });
  res.status(200).json({
    saveMapObject,
  });
};
