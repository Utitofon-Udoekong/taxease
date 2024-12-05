import jsPDF from 'jspdf'
import autoTable, { applyPlugin } from 'jspdf-autotable';
import * as XLSX from 'xlsx';
applyPlugin(jsPDF)

export interface ExportFormat {
    id: string;
    name: string;
    extension: string;
    generate: (data: StandardTaxReport) => string | Blob;
}

const generateCSV = (data: StandardTaxReport): string => {
    const headers = [
        'Date',
        'Transaction ID',
        'Category',
        'Description',
        'Amount',
        'Currency',
        'Deductible',
        'Payer Address',
        'Payee Address',
        'Status'
    ];

    const rows = data.transactions.map((tx: ClientTransaction) => [
        new Date(tx.timestamp).toISOString().split('T')[0],
        tx.requestId,
        tx.category,
        tx.amount,
        tx.currency,
        tx.deductible ? 'Yes' : 'No',
        tx.from,
        tx.to,
        tx.status
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
};

const generateExcel = (data: StandardTaxReport): Blob => {
    const workbook = XLSX.utils.book_new();

    // Transactions sheet
    const transactionRows = data.transactions.map(tx => ({
        Date: new Date(tx.timestamp).toISOString().split('T')[0],
        'Transaction ID': tx.requestId,
        Category: tx.category,
        Amount: tx.amount,
        Currency: tx.currency,
        Deductible: tx.deductible ? 'Yes' : 'No',
        'Payer Address': tx.from,
        'Payee Address': tx.to,
        Status: tx.status
    }));

    const transactionsSheet = XLSX.utils.json_to_sheet(transactionRows);
    XLSX.utils.book_append_sheet(workbook, transactionsSheet, 'Transactions');

    // Summary sheet
    const summaryData = [
        ['Period', `${data.periodStart.toLocaleDateString()} - ${data.periodEnd.toLocaleDateString()}`],
        ['Total Income', data.summary.totalIncome],
        ['Total Expenses', data.summary.totalExpenses],
        ['Net Income', data.summary.netIncome],
        ['Total Deductible', data.summary.totalDeductible]
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Convert to blob
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

const generatePDF = (data: StandardTaxReport): Blob => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text('Tax Report', 14, 22);

    // Add period
    doc.setFontSize(12);
    doc.text(
        `Period: ${data.periodStart.toLocaleDateString()} - ${data.periodEnd.toLocaleDateString()}`,
        14, 32
    );

    // Add summary
    autoTable(doc, {
        head: [['Summary', 'Amount']],
        body: [
            ['Total Income', data.summary.totalIncome],
            ['Total Expenses', data.summary.totalExpenses],
            ['Net Income', data.summary.netIncome],
            ['Total Deductible', data.summary.totalDeductible]
        ],
        startY: 40
    });


    // Add transactions
    autoTable(doc, {
        head: [['Date', 'Category', 'Amount', 'Deductible', 'Status']],
        body: data.transactions.map(tx => [
            new Date(tx.timestamp).toLocaleDateString(),
            tx.category,
            `${tx.amount} ${tx.currency}`,
            tx.deductible ? 'Yes' : 'No',
            tx.status
        ]),
        startY: (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10
    });

    return doc.output('blob');
};

export const exportFormats: ExportFormat[] = [
    {
        id: 'csv',
        name: 'CSV',
        extension: '.csv',
        generate: generateCSV
    },
    {
        id: 'xlsx',
        name: 'Excel',
        extension: '.xlsx',
        generate: generateExcel
    },
    {
        id: 'pdf',
        name: 'PDF Report',
        extension: '.pdf',
        generate: generatePDF
    }
]; 