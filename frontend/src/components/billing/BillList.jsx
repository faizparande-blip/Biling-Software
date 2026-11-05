import React from 'react';
import Table from '../common/Table';

export default function BillList({ bills = [] }) {
  const columns = [
    { header: 'Bill #', accessor: 'bill_number' },
    { header: 'Type', accessor: 'bill_type' },
    { header: 'Party', accessor: 'party_name' },
    { header: 'Bags', accessor: 'total_bags', align: 'right' },
    { header: 'Weight (Qtl)', accessor: 'total_weight', align: 'right' },
    { header: 'Net Amount', accessor: 'net_payable_amount', align: 'right' },
    { header: 'Status', accessor: 'payment_status' },
  ];

  return (
    <div className="bill-list-container">
      <Table columns={columns} data={bills} emptyMessage="No bills generated yet." />
    </div>
  );
}
