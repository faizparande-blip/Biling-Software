import React from 'react';

export default function PartyForm({ partyType = 'farmer', onSuccess }) {
  return (
    <form className="party-form" onSubmit={(e) => e.preventDefault()}>
      <div className="form-group">
        <label>{partyType === 'farmer' ? 'Farmer Name' : 'Trader / Buyer Name'}</label>
        <input type="text" placeholder="Enter party full name" />
      </div>
      <div className="form-group">
        <label>Phone Number</label>
        <input type="text" placeholder="10-digit mobile number" />
      </div>
      <div className="form-group">
        <label>Village / City</label>
        <input type="text" placeholder="Village or City" />
      </div>
      <button type="submit" className="btn-primary">Save Party</button>
    </form>
  );
}
