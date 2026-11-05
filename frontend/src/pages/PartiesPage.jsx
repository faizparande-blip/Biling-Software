import React, { useState } from 'react';
import Header from '../components/common/Header';
import PartyList from '../components/parties/PartyList';
import PartyForm from '../components/parties/PartyForm';
import Modal from '../components/common/Modal';

export default function PartiesPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="parties-page">
      <Header
        title="Parties Directory"
        subtitle="Manage Farmers (Sellers), Buyers (Traders) and Brokers"
        actions={
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Add New Party
          </button>
        }
      />

      <PartyList parties={[]} />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Register New Party"
      >
        <PartyForm onSuccess={() => setShowModal(false)} />
      </Modal>
    </div>
  );
}
