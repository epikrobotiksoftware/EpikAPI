const RosModel = require('../models/rosModel');

//Actions
exports.getAllActions = async (req, res) => {
  try {
    const newAction = await RosModel.Action.find();
    res.status(201).json({
      status: 'success',
      data: {
        Actions: newAction,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'fail',
      err,
    });
  }
};
exports.getAction = async (req, res) => {
  try {
    const newAction = await RosModel.Action.findById(req.params.id);
    res.status(201).json({
      status: 'success',
      data: {
        Action: newAction,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'fail',
      err,
    });
  }
};
exports.deleteAction = async (req, res) => {
  try {
    const newAction = await RosModel.Action.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'fail',
      err,
    });
  }
};
exports.createAction = async (req, res) => {
  try {
    const newAction = await RosModel.Action.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        Action: newAction,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'fail',
      err,
    });
  }
};
///////////////////////////////////////////////////////
//Missions
exports.getAllMissions = async (req, res) => {
  try {
    const newMission = await RosModel.Mission.find();
    res.status(201).json({
      status: 'success',
      data: {
        Missions: newMission,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'fail',
      err,
    });
  }
};
exports.getMission = async (req, res) => {
  try {
    const newMission = await RosModel.Mission.findById(req.params.id);
    res.status(201).json({
      status: 'success',
      data: {
        Mission: newMission,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'fail',
      err,
    });
  }
};
exports.createMission = async (req, res) => {
  try {
    const newMission = await RosModel.Mission.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        Mission: newMission,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'fail',
      err,
    });
  }
};
exports.deleteMission = async (req, res) => {
  try {
    const newMission = await RosModel.Mission.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 'fail',
      err,
    });
  }
};
