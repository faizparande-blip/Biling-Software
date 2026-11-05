import React from 'react';
import Table from '../common/Table';

export default function LedgerView({ entries = [] }) {
  const columns = [
    { header: 'Date', accessor: 'entry_date' },
    { header: 'Voucher #', accessor: 'voucher_number' },
    { header: 'Type', accessor: 'entry_type' },
    { header: 'Mode', accessor: 'payment_mode' },
    { header: 'Amount', accessor: 'amount', align: 'right' },
    { header: 'Balance', accessor: 'running_balance', align: 'right' },
  ];

  return <Table columns={columns} data={entries} emptyMessage="No transactions in this account." />;
}
