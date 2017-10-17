// This is a donation schema to represent individual donations

const mongoose = require('mongoose');

// retrieve further information on the donor with additional query.
// using an object reference directly to the User object
// extend the schema from above to refer to the candidate:
const donationSchema = mongoose.Schema({
  amount: Number,
  method: String,
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  candidate:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
  },
});

const Donation = mongoose.model('Donation', donationSchema);
module.exports = Donation;
