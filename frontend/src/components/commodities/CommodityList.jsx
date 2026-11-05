import React from 'react';
import Table from '../common/Table';

export default function CommodityList({ commodities = [] }) {
  const columns = [
    { header: 'Commodity Name', accessor: 'name' },
    { header: 'Unit', accessor: 'standard_unit' },
    { header: 'Bag Weight (KG)', accessor: 'bag_weight_kg', align: 'right' },
    { header: 'Mandi Tax (%)', accessor: 'mandi_tax_rate', align: 'right' },
    { header: 'Commission (%)', accessor: 'commission_rate', align: 'right' },
  ];

  return <Table columns={columns} data={commodities} emptyMessage="No commodities found." />;
}
