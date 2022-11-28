const rosnodejs = require('rosnodejs');
const nh = rosnodejs.nh;

exports.createTopics = () =>{
    const pubjoystick = nh.advertise('/cmd_vel', 'geometry_msgs/Twist');
}

exports.rosStart = ()=>{


rosnodejs.initNode('/ArslanNode')
.then(() => {
    console.log('node created');
    //create topic
    // const pubjoystick = nh.advertise('/cmd_vel', 'geometry_msgs/Twist');
    // console.log(pubjoystick);

    // const sub = nh.subscribe('/arslanTopic', 'std_msgs/String');
    // console.log(sub);
})
.catch((err)=>{
    console.log(err);
})
}