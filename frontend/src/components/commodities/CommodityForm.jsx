import React from 'react';

export default function CommodityForm() {
  return (
    <form className="commodity-form" onSubmit={(e) => e.preventDefault()}>
      <div className="form-group">
        <label>Crop / Commodity Name</label>
        <input type="text" placeholder="e.g. Wheat, Mustard, Paddy" />
      </div>
      <div className="form-group">
        <label>Standard Bag Weight (KG)</label>
        <input type="number" defaultValue="50" />
      </div>
      <button type="submit" className="btn-primary">Add Commodity</button>
    </form>
  );
}
