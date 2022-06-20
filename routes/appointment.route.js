const express = require("express");
const {
  newAppointment,
  allAppointments,
  userAppointments,
  deleteAppointments,
  appointmentsPay,
} = require("../controller/appointment.controller");

const appointmentRoute = express.Router();

appointmentRoute.post("/", newAppointment);

appointmentRoute.get("/", allAppointments);

appointmentRoute.get("/:id", userAppointments);

appointmentRoute.delete("/:id", deleteAppointments);

appointmentRoute.put("/:id", appointmentsPay);

module.exports = appointmentRoute;
