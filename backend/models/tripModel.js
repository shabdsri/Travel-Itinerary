const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  // Yeh field trip ko us user se connect karegi jisne login kiya hai
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  destination: { 
    type: String, 
    required: true, 
    trim: true 
  },
  startDate: { 
    type: String, 
    required: true 
  },
  endDate: { 
    type: String, 
    required: true 
  },
  budget: { 
    type: Number, 
    default: 0 
  },
  // Day-by-day plan ko hum ek simple array of strings mein rakhenge
  // Example: ["Day 1: Arrival & Hotel Check-in", "Day 2: Taj Mahal Visit", "Day 3: Local Market & Departure"]
  itinerary: [
    { 
      type: String 
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);