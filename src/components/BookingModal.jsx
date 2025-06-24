// components/BookingModal.jsx
import React from "react";
import Swal from "sweetalert2";
import axios from "axios";
import api from "../api/axios";

import { FaCheck } from "react-icons/fa";

const BookingModal = ({
  onClose,
  participants,
  totalPrice,
  selectedDate,
  tourName,
  tourId,
  user,
}) => {
  const handleConfirmBooking = async () => {
    try {
      const response = await api.post(
        "http://localhost:8000/api/bookings",
        {
          tour_id: tourId,
          number_of_people: participants,
          notes: `Booking for ${tourName} on ${selectedDate}`,
          totalAmount: totalPrice,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Booking Confirmed!",
        html: `
          <div class="text-start">
            <h4 class="mb-3">${tourName}</h4>
            <p><strong>Date:</strong> ${selectedDate}</p>
            <p><strong>Participants:</strong> ${participants}</p>
            <p><strong>Total:</strong> $${totalPrice}</p>
            <p class="mt-3">Your booking ID: ${response.data.booking.booking_code}</p>
            <p>You'll receive a confirmation email shortly.</p>
          </div>
        `,
        confirmButtonText: "Got it!",
        customClass: {
          popup: "rounded-4",
        },
      }).then(() => onClose());
    } catch (error) {
      console.error("Booking failed:", error);
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: error.response?.data?.message || "Something went wrong",
        confirmButtonText: "OK",
        customClass: {
          popup: "rounded-4",
        },
      });
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content rounded-4 shadow border-0">
          <div className="modal-header border-0 bg-light">
            <h5 className="modal-title fw-bold">Confirm Your Booking</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="d-flex mb-3">
              <div className="flex-grow-1">
                <h6 className="fw-bold mb-1">{tourName}</h6>
                <small className="text-muted">{selectedDate}</small>
              </div>
              <div className="text-end">
                <h5 className="fw-bold text-primary">${totalPrice}</h5>
                <small className="text-muted">
                  {participants} {participants > 1 ? "persons" : "person"}
                </small>
              </div>
            </div>

            <div className="alert alert-info mt-3">
              <div className="d-flex align-items-start">
                <FaCheck className="text-primary mt-1 me-2" />
                <small>Free cancellation up to 24 hours before the tour</small>
              </div>
            </div>
          </div>
          <div className="modal-footer border-0">
            <button
              type="button"
              className="btn btn-outline-secondary rounded-pill px-4"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary rounded-pill px-4"
              onClick={handleConfirmBooking}
            >
              Confirm & Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
