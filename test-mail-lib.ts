import dotenv from 'dotenv';
import { sendEmail } from './lib/mail';

dotenv.config();

async function testLib() {
    console.log('Testing lib/mail.ts with new credentials...');
    const result = await sendEmail({
        to: 'info@rootedrising.org.ng',
        subject: 'Test Email from Lib',
        html: '<h3>Test successful!</h3><p>This email was sent using the projects internal mail utility.</p>'
    });
    
    if (result.success) {
        console.log('Successfully sent using lib/mail.ts');
        console.log('Response:', JSON.stringify(result.data, null, 2));
    } else {
        console.error('Failed to send using lib/mail.ts:', result.error);
    }
}

testLib();
