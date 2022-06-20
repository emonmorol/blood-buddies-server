const { ObjectId } = require("mongodb");
const client = require("../connection/connection");

const appointmentCollection = client
  .db("blood-buddies")
  .collection("appointments");

exports.newAppointment = async (req, res) => {
  const { email, date } = req.query;
  console.log(email, date);
  const query = { email: email, date: date };
  const appoints = await appointmentCollection.findOne(query);
  if (appoints) {
    res.send({ success: false });
  } else {
    const appointment = req.body;
    const result = await appointmentCollection.insertOne(appointment);
    res.send({ success: true });
  }
};

exports.allAppointments = async (req, res) => {
  const { email } = req.query;
  const query = { email: email };
  const appoints = await appointmentCollection.find(query).toArray();
  res.send(appoints);
};

exports.userAppointments = async (req, res) => {
  const { id } = req.params;
  const query = { _id: ObjectId(id) };
  const appoints = await appointmentCollection.findOne(query);
  res.send(appoints);
};

exports.deleteAppointments = async (req, res) => {
  const { id } = req.params;
  const query = { _id: ObjectId(id) };
  const appoints = await appointmentCollection.deleteOne(query);
  res.send(appoints);
};

exports.appointmentsPay = async (req, res) => {
  const { id } = req.params;
  const { appointmentId, transactionId } = req.body;
  const filter = { _id: ObjectId(id) };
  const options = { upsert: true };
  const updateDoc = {
    $set: {
      appointmentId,
      transactionId,
    },
  };

  const result = await appointmentCollection.updateOne(
    filter,
    updateDoc,
    options
  );

  res.send(result);
};
