
import { supabase } from '../src/config/supabase';

async function setupStorage() {
    console.log('Starting storage setup...');

    const buckets = [
        { id: 'documents', public: true },
        { id: 'signed-documents', public: true },
        { id: 'signatures', public: true }
    ];

    for (const bucket of buckets) {
        console.log(`Checking bucket: ${bucket.id}`);
        const { data, error } = await supabase.storage.getBucket(bucket.id);

        if (error && error.message.includes('not found')) {
            console.log(`Creating bucket: ${bucket.id}`);
            const { data: newBucket, error: createError } = await supabase.storage.createBucket(
                bucket.id,
                {
                    public: bucket.public,
                    fileSizeLimit: 10485760, // 10MB
                    allowedMimeTypes: bucket.id === 'signatures' ? ['image/png', 'image/jpeg'] : ['application/pdf']
                }
            );

            if (createError) {
                console.error(`Error creating bucket ${bucket.id}:`, createError);
            } else {
                console.log(`Bucket ${bucket.id} created successfully.`);
            }
        } else if (error) {
            console.error(`Error checking bucket ${bucket.id}:`, error);
        } else {
            console.log(`Bucket ${bucket.id} already exists.`);
        }
    }

    console.log('Storage setup complete.');
}

setupStorage().catch(console.error);
