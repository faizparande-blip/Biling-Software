import React from 'react';
import Table from '../common/Table';

export default function PartyList({ parties = [] }) {
  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Type', accessor: 'party_type' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Location', accessor: 'village_or_city' },
    { header: 'Current Balance', accessor: 'current_balance', align: 'right' },
  ];

  return <Table columns={columns} data={parties} emptyMessage="No parties registered." />;
}
