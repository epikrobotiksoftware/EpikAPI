const rosnodejs = require('rosnodejs');
const Position = require('./../models/rosModel')
const eulerToQte = require('../utils/eulerToQte');
const PositionMarkerNavigateSrv = rosnodejs.require('mir_navigation').srv.PositionMarkerNavigate;
exports.createPositionMarker = async (req, res) => {

    try {
        const newMarker = await Position.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                Position: newMarker
            }
        })
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            data:{
                err
            }
        })
        console.log(err);
    }
}

exports.getAllPositionMarkers = async (req, res) => {

    try {
        const newMarker = await Position.find();
        res.status(201).json({
            status: 'success',
            data: {
                Position: newMarker
            }
        })
    } catch (err) {
        console.log(err);
    }
}

exports.getPositionMarker = async (req, res) => {

    try {
        const newMarker = await Position.findById(req.params.id);
        res.status(201).json({
            status: 'success',
            data: {
                Position: newMarker
            }
        })
    } catch (err) {
        console.log(err);
    }
}

exports.deletePositionMarker = async (req, res) => {

    try {
        const newMarker = await Position.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: {
                Position: null
            }
        })
    } catch (err) {
        console.log(err);
    }
}

exports.sendGoal = async (req, res) => {
    var request = new PositionMarkerNavigateSrv.Request();

    const marker = await Position.findById(req.params.id);
    // one last thing
    // marker.rotation must be converted Euler to Quaterion search this and write the converted values
    // you have only yaw degree so convert (0,0,y) to (x,y,z,w) 

    const rotationArray = {x: 0, y: 0, z: marker.rotation };
    // [0,0,marker.rotation];
    const rotationROS = eulerToQte.eulerToQuaternion(rotationArray);
    console.log(rotationROS);
    request.goal = {
        position: {
          x: marker.x,
          y: marker.y,
          z: 0
        },
        orientation: { // here
          w: rotationROS[0],
          x: rotationROS[1],
          y: rotationROS[2],
          z: rotationROS[3]
        }
      };
    //   request.marker_name = marker.name;

    rosnodejs.initNode('/my_node')
        .then(() => {
            const nh = rosnodejs.nh;
            const client = nh.serviceClient('/PositionMarkerNavigate', 'mir_navigation/PositionMarkerNavigate');
            client.call(request);
            res.status(200).json({
                Status: 'success',
                Message: `Goal has been sent to ROS `,
                Destination : `${marker.name}`

            })
        });

}