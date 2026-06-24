const express = require('express');
const router = express.Router();
const Trip = require('../models/tripModel');
const authorise = require('../middleware/auth'); // Aapki auth middleware file

// 1. CREATE: Naya Trip Add Karne Ke Liye (Path: /trip/add)
router.post('/add', authorise, async (req, res) => {
  try {
    const { destination, startDate, endDate, budget, itinerary } = req.body;

    const newTrip = new Trip({
      user: req.user._id, // middleware/auth.js se user ki id mil jayegi
      destination,
      startDate,
      endDate,
      budget,
      itinerary
    });

    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// 2. READ: Logged-in User ki Saari Trips Get Karne Ke Liye (Path: /trip/getmytrips)
router.get('/getmytrips', authorise, async (req, res) => {
  try {
    // Sirf isi user ki trips find karega
    const trips = await Trip.find({ user: req.user._id });
    res.status(200).json(trips);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// 3. DELETE: Kisi Specific Trip Ko Delete Karne Ke Liye (Path: /trip/delete/:id)
router.delete('/delete/:id', authorise, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check karein ki kya yeh trip isi user ki hai
    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this trip' });
    }

    await trip.deleteOne();
    res.status(200).json({ message: 'Trip removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// 4. UPDATE: Kisi Specific Trip Ko Edit/Update Karne Ke Liye (Path: /trip/update/:id)
router.put('/update/:id', authorise, async (req, res) => {
  try {
    const { destination, startDate, endDate, budget, itinerary } = req.body;

    let trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check karein ki kya yeh trip isi user ki hai
    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to edit this trip' });
    }

    // Data ko update karein
    trip.destination = destination || trip.destination;
    trip.startDate = startDate || trip.startDate;
    trip.endDate = endDate || trip.endDate;
    trip.budget = budget !== undefined ? budget : trip.budget;
    trip.itinerary = itinerary || trip.itinerary;

    const updatedTrip = await trip.save();
    res.status(200).json(updatedTrip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = router;