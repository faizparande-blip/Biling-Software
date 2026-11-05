import React from 'react';

export default function Table({ columns, data, emptyMessage = 'No records found' }) {
  return (
    <div className="table-responsive">
      <table className="mab-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} style={{ textAlign: col.align || 'left' }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((row, rIdx) => (
              <tr key={row.id || rIdx}>
                {columns.map((col, cIdx) => (
                  <td key={cIdx} style={{ textAlign: col.align || 'left' }}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="table-empty">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
