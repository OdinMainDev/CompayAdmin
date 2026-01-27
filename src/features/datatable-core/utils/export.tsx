import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export interface IExportOptions<T = any> {
  data: T[];
  headers: { label: string; value: string }[];
  fileName?: string;
}

export async function handleExport<T extends Record<string, unknown>>(
  data: T[],
  format: 'excel' | 'csv',
  fileName = 'export',
) {
  if (!data || !data.length) return;

  const keys = Object.keys(data[0]) as Array<keyof T>;

  const headers = keys.map((key) => ({
    label: String(key)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    value: key,
  }));

  if (format === 'excel') {
    const transformData = data.map((item) => headers.map((header) => item[header.value]));

    const headerRow = headers.map((h) => h.label);

    const ws = XLSX.utils.json_to_sheet([], { header: headerRow, skipHeader: true });
    XLSX.utils.sheet_add_aoa(ws, [headerRow], { origin: 'A1' });
    XLSX.utils.sheet_add_json(ws, transformData, { origin: 'A2', skipHeader: true });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  if (format === 'csv') {
    const headersString = headers.map((h) => h.label).join(',');
    const csvContent = data
      .map((row) => headers.map((h) => `"${row[h.value]}"`).join(','))
      .join('\n');
    const finalCsv = `${headersString}\n${csvContent}`;
    const blob = new Blob([finalCsv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${fileName}.csv`);
  }
}
