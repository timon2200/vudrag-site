import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Resend only if API key is provided
// Without an API key, password reset emails will be disabled (but CMS will still work)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

if (!resend) {
    console.warn('⚠️ RESEND_API_KEY not set - Password reset emails will be disabled');
}

const FROM_EMAIL = 'onboarding@resend.dev'; // Default for testing, user should update

export async function sendPasswordResetEmail(email, resetToken, host, settings = {}) {
    // Check if email service is available
    if (!resend) {
        console.error('❌ Cannot send email: RESEND_API_KEY not configured');
        return false;
    }

    const resetLink = `${host}/reset-password.html?token=${resetToken}`;
    const emailConfig = settings.email || {};

    // Defaults
    const fromName = emailConfig.fromName || 'Nikola Vudrag Archive';
    const fromEmail = emailConfig.fromEmail || 'onboarding@resend.dev';
    const subject = emailConfig.resetSubject || 'Reset your password';

    // Default Body Template
    const defaultBody = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; color: #333;">
            <h1 style="color: #c9a77a; text-align: center;">Password Reset Request</h1>
            <p>You requested to reset your password for the Nikola Vudrag Archive.</p>
            <p>Click the button below to reset it (valid for 1 hour):</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{link}}" style="background: #c9a77a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
            </div>
            <p style="font-size: 12px; color: #666;">If you didn't request this, purely ignore this email.</p>
        </div>
    `;

    const bodyTemplate = emailConfig.resetBody || defaultBody;
    const html = bodyTemplate.replace('{{link}}', resetLink);

    try {
        const { data, error } = await resend.emails.send({
            from: `${fromName} <${fromEmail}>`,
            to: [email],
            subject: subject,
            html: html
        });

        if (error) {
            console.error('Resend Error:', error);
            return false;
        }

        console.log('Email sent successfully:', data);
        return true;
    } catch (err) {
        console.error('Email Sending Failed:', err);
        return false;
    }
}
