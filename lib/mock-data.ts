import { getCloudinaryUrl } from './cloudinary';

// Helper untuk generate URL Cloudinary
const cloudinaryImage = (publicId: string) => getCloudinaryUrl(publicId, { width: 400, height: 400, quality: 80 });

export const mockProducts = [
    { id: 1, name: "Original Es Teh", price: 5000, category: "Classic Series", imageUrl: cloudinaryImage("esteh/original-esteh") },
    { id: 2, name: "Es Teh Lemon", price: 7000, category: "Fruit Series", imageUrl: cloudinaryImage("esteh/esteh-lemon") },
    { id: 3, name: "Es Teh Susu", price: 8000, category: "Milk Series", imageUrl: cloudinaryImage("esteh/esteh-susu") },
    { id: 4, name: "Es Teh Leci", price: 9000, category: "Fruit Series", imageUrl: cloudinaryImage("esteh/esteh-leci") },
    { id: 5, name: "Es Teh Tarik", price: 10000, category: "Milk Series", imageUrl: cloudinaryImage("esteh/esteh-tarik") },
    { id: 6, name: "Es Teh Matcha", price: 12000, category: "Milk Series", imageUrl: cloudinaryImage("esteh/esteh-matcha") },
    { id: 7, name: "Es Teh Yakult", price: 11000, category: "Fruit Series", imageUrl: cloudinaryImage("esteh/esteh-yakult") },
    { id: 8, name: "Es Teh Coklat", price: 10000, category: "Milk Series", imageUrl: cloudinaryImage("esteh/esteh-coklat") },
];

export const categories = ["All", "Classic Series", "Fruit Series", "Milk Series"];

export const mockDailySales = [
    { name: 'Mon', sales: 400000 },
    { name: 'Tue', sales: 300000 },
    { name: 'Wed', sales: 550000 },
    { name: 'Thu', sales: 450000 },
    { name: 'Fri', sales: 700000 },
    { name: 'Sat', sales: 900000 },
    { name: 'Sun', sales: 850000 },
];

export const mockTransactions = [
    { id: "TRX-001", cashier: "John Doe", total: 25000, method: "Cash", date: "2024-05-20 10:30" },
    { id: "TRX-002", cashier: "Jane Smith", total: 45000, method: "QRIS", date: "2024-05-20 11:15" },
    { id: "TRX-003", cashier: "John Doe", total: 15000, method: "Cash", date: "2024-05-20 11:45" },
    { id: "TRX-004", cashier: "John Doe", total: 80000, method: "Cash", date: "2024-05-20 12:20" },
    { id: "TRX-005", cashier: "Jane Smith", total: 32000, method: "QRIS", date: "2024-05-20 13:10" },
];
