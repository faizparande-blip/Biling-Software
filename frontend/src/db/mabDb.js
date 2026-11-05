import Dexie from 'dexie';

/**
 * Client-Side Local IndexedDB for M.A.B TRADERS
 * Powered by Dexie.js - Zero Backend Required, 100% Offline Durability
 */

export const db = new Dexie('MAB_Traders_Local_DB');

db.version(1).stores({
  bills: '++id, receipt_no, bill_date, farmer_name, village, created_at',
  settings: 'key',
});

// Default settings
export const DEFAULT_SETTINGS = {
  business_info: {
    name: 'M.A.B TRADERS',
    tagline: 'कांदा, बटाटे, लसूण, व शेंगा, फ्रूट अॅन्ड व्हेजीटेबल कमिशन एजंट ऑर्डर सप्लायर्स',
    address: 'गाळा नं. सी - ७, ई - ५८, श्री सिध्देश्वर मार्केट यार्ड, सोलापूर (महाराष्ट्र)',
    contacts: [
      { name: 'Nehal', phone: '9699485027' },
      { name: 'Faizan', phone: '7083038821' },
      { name: 'Izhan', phone: '9028342736' },
      { name: 'Muzammil', phone: '9922559471' },
    ],
  },
  print_settings: {
    paperSize: 'standard', // 'standard' (8-inch 203mm continuous) | 'thermal' (80mm) | 'custom'
    customWidthMm: 203,
    showGraphics: true,    // Produce Graphics toggle
    printMarginMm: 2,
  },
  billing_settings: {
    defaultRateBasis: 'quintal', // 'quintal' (Rate / 100) | '10kg' (Rate / 10) | 'bag' (Rate * bags)
    defaultVillage: '',
  },
};

export const localDbService = {
  /**
   * Get next sequential receipt number
   */
  async getNextReceiptNumber() {
    try {
      const highestBill = await db.bills.orderBy('receipt_no').last();
      return highestBill ? highestBill.receipt_no + 1 : 1;
    } catch (err) {
      console.error('Error getting next receipt number from Dexie:', err);
      return 1;
    }
  },

  /**
   * Save or update a bill record
   */
  async saveBill(billData) {
    const isExisting = billData.id !== null && billData.id !== undefined && billData.id !== '';
    const now = new Date().toISOString();

    let receiptNo = billData.receipt_no;
    if (!receiptNo) {
      receiptNo = await this.getNextReceiptNumber();
    } else {
      // Prevent duplicate receipt numbers for new bills
      if (!isExisting) {
        const existing = await db.bills.where('receipt_no').equals(Number(receiptNo)).first();
        if (existing) {
          receiptNo = await this.getNextReceiptNumber();
        }
      }
    }

    const payload = {
      ...billData,
      receipt_no: Number(receiptNo),
      farmer_name: (billData.farmer_name || '').trim(),
      village: (billData.village || '').trim(),
      account_no: (billData.account_no || '').trim(),
      updated_at: now,
    };

    if (isExisting) {
      payload.id = Number(billData.id);
      await db.bills.put(payload);
      return payload;
    } else {
      payload.created_at = now;
      delete payload.id; // Let Dexie assign auto-increment id
      const id = await db.bills.add(payload);
      payload.id = id;
      return payload;
    }
  },

  /**
   * Fetch bills with optional search query & date filter
   */
  async getAllBills(searchQuery = '', filterDate = '') {
    try {
      let collection = db.bills.orderBy('receipt_no').reverse();
      let all = await collection.toArray();

      if (filterDate) {
        all = all.filter((b) => b.bill_date === filterDate);
      }

      if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        all = all.filter((b) => {
          const recMatch = String(b.receipt_no).includes(q);
          const farmerMatch = b.farmer_name && b.farmer_name.toLowerCase().includes(q);
          const villageMatch = b.village && b.village.toLowerCase().includes(q);
          const accMatch = b.account_no && b.account_no.toLowerCase().includes(q);
          return recMatch || farmerMatch || villageMatch || accMatch;
        });
      }

      return all;
    } catch (err) {
      console.error('Error fetching bills from Dexie:', err);
      return [];
    }
  },

  /**
   * Get single bill by ID
   */
  async getBillById(id) {
    return await db.bills.get(Number(id));
  },

  /**
   * Delete bill by ID
   */
  async deleteBill(id) {
    await db.bills.delete(Number(id));
    return { status: 'success' };
  },

  /**
   * Bulk insert for Excel Restore
   */
  async restoreBills(billsArray, overwrite = false) {
    if (overwrite) {
      await db.bills.clear();
      await db.bills.bulkAdd(billsArray);
    } else {
      // Merge: update existing, add new
      for (const bill of billsArray) {
        const existing = await db.bills.where('receipt_no').equals(Number(bill.receipt_no)).first();
        if (existing) {
          await db.bills.put({ ...bill, id: existing.id });
        } else {
          delete bill.id;
          await db.bills.add(bill);
        }
      }
    }
    return true;
  },

  /**
   * Settings management
   */
  async getSetting(key) {
    try {
      const record = await db.settings.get(key);
      return record ? record.value : DEFAULT_SETTINGS[key] || null;
    } catch (err) {
      return DEFAULT_SETTINGS[key] || null;
    }
  },

  async saveSetting(key, value) {
    await db.settings.put({ key, value });
    return value;
  },
};
