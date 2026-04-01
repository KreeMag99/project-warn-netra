import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const verifyLink = `${baseUrl}/verify?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Project WARN <no-reply@project-warn.vercel.app>',
      to: email,
      subject: 'Verify your Project WARN alert subscription',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #18181b; margin-top: 0;">Verify Your Subscription</h2>
          <p style="color: #52525b; font-size: 16px; line-height: 1.6;">Thank you for subscribing to Project WARN email alerts.</p>
          <p style="color: #52525b; font-size: 16px; line-height: 1.6;">Please click the secure button below to verify your email address and immediately activate your layoff tracking alerts:</p>
          <div style="margin: 35px 0; text-align: center;">
            <a href="${verifyLink}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #52525b; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${verifyLink}" style="color: #2563eb;">${verifyLink}</a>
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #71717a; font-size: 12px; margin-bottom: 0;">If you did not request this email, you can safely ignore it. Your email has not been added to any active alert lists yet.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Failed to send verification email (Resend API Error):', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Failed to send verification email (Caught Error):', err);
    return { success: false, error: err };
  }
}
