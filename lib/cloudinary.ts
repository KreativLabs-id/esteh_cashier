// Cloudinary helper untuk generate URL gambar produk

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'ddwszkuzv';

/**
 * Generate Cloudinary URL untuk gambar produk
 * @param publicId - Public ID gambar di Cloudinary (tanpa ekstensi)
 * @param options - Opsi transformasi gambar
 */
export function getCloudinaryUrl(
    publicId: string,
    options: {
        width?: number;
        height?: number;
        quality?: number;
        format?: 'auto' | 'webp' | 'jpg' | 'png';
    } = {}
): string {
    const { width = 400, height = 400, quality = 80, format = 'auto' } = options;
    
    // Build transformation string
    const transformations = [
        `w_${width}`,
        `h_${height}`,
        'c_fill', // Crop mode: fill
        `q_${quality}`,
        `f_${format}`,
    ].join(',');

    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
}

/**
 * Mapping nama produk ke public ID Cloudinary
 * Kamu perlu upload gambar ke Cloudinary dan update mapping ini
 */
export const productImageMap: Record<string, string> = {
    // Tea Series
    'Original Es Teh': 'esteh/original-esteh',
    'Es Teh Manis': 'esteh/esteh-manis',
    'Es Teh Tawar': 'esteh/esteh-tawar',
    
    // Fruit Series
    'Es Teh Lemon': 'esteh/esteh-lemon',
    'Es Teh Leci': 'esteh/esteh-leci',
    'Es Teh Jeruk': 'esteh/esteh-jeruk',
    
    // Milk Series
    'Es Teh Susu': 'esteh/esteh-susu',
    'Es Teh Tarik': 'esteh/esteh-tarik',
    'Es Teh Matcha': 'esteh/esteh-matcha',
    'Es Teh Coklat': 'esteh/esteh-coklat',
    
    // Yakult Series
    'Es Teh Yakult': 'esteh/esteh-yakult',
    
    // Mojito Series
    'Es Teh Mojito': 'esteh/esteh-mojito',
    
    // Signature Series
    'Teh Barudak Signature': 'esteh/signature',
};

/**
 * Get Cloudinary URL untuk produk berdasarkan nama
 * Fallback ke placeholder jika tidak ada mapping
 */
export function getProductImageUrl(productName: string): string {
    const publicId = productImageMap[productName];
    
    if (publicId) {
        return getCloudinaryUrl(publicId);
    }
    
    // Fallback ke placeholder image
    return getCloudinaryUrl('esteh/placeholder', { width: 400, height: 400 });
}
