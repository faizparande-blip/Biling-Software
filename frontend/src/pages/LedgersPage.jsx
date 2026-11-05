import React, { useState } from 'react';
import Header from '../components/common/Header';
import LedgerView from '../components/ledgers/LedgerView';
import PaymentEntry from '../components/ledgers/PaymentEntry';
import Modal from '../components/common/Modal';

export default function LedgersPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="ledgers-page">
      <Header
        title="Khata & Ledgers"
        subtitle="Double-entry Mandi Accounting, Cash Book & Party Ledgers"
        actions={
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Post Voucher
          </button>
        }
      />

      <LedgerView entries={[]} />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Post Cash / Bank Voucher"
      >
        <PaymentEntry />
      </Modal>
    </div>
  );
}
