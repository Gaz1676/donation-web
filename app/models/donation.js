// This is a donation schema to represent individual donations

const mongoose = require('mongoose');

const donationSchema = mongoose.Schema({
  amount: Number,
  method: String,
  donor: String, // included to schema model to store some information about the donor
});

const Donation = mongoose.model('Donation', donationSchema);
module.exports = Donation;
