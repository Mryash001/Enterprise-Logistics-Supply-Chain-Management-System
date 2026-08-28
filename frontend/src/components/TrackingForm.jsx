import { useState } from "react";

function TrackingForm({ onSearch, loading }) {
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!trackingNumber.trim()) {
      return;
    }

    onSearch(trackingNumber.trim());
  };

  return (
    <form className="tracking-form" onSubmit={handleSubmit}>
      <div className="form-group tracking-input">
        <label>Tracking Number</label>

        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Enter tracking number, e.g. TRK004"
          required
        />
      </div>

      <button
        type="submit"
        className="primary-btn tracking-btn"
        disabled={loading}
      >
        {loading ? "Searching..." : "Track Shipment"}
      </button>
    </form>
  );
}

export default TrackingForm;