import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
    reservationDate: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    guests: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ['Booked', 'Cancelled', 'Completed'], default: 'Booked' },
  },
  { timestamps: true }
);

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;
