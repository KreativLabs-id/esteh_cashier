import { NextRequest, NextResponse } from 'next/server';

// Cloudinary upload endpoint
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'esteh_products';

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const dataUri = `data:${file.type};base64,${base64}`;

        // Upload to Cloudinary
        const cloudinaryResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    file: dataUri,
                    upload_preset: uploadPreset,
                    folder: 'esteh',
                }),
            }
        );

        if (!cloudinaryResponse.ok) {
            const error = await cloudinaryResponse.json();
            console.error('Cloudinary error:', error);
            return NextResponse.json({ error: 'Failed to upload to Cloudinary' }, { status: 500 });
        }

        const result = await cloudinaryResponse.json();
        
        return NextResponse.json({
            url: result.secure_url,
            publicId: result.public_id,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }
}
