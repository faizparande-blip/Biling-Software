import React, { useState } from 'react';
import Header from '../components/common/Header';
import CommodityList from '../components/commodities/CommodityList';
import CommodityForm from '../components/commodities/CommodityForm';
import Modal from '../components/common/Modal';

export default function CommoditiesPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="commodities-page">
      <Header
        title="Commodity Directory"
        subtitle="Manage Agricultural Produce, Bag Weights & Mandi Rates"
        actions={
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Add Commodity
          </button>
        }
      />

      <CommodityList commodities={[]} />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Commodity"
      >
        <CommodityForm />
      </Modal>
    </div>
  );
}
