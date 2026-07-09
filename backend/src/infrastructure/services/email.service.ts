import nodemailer from 'nodemailer';

// ─── Email Service ─────────────────────────────────────────────────────────────

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT ?? '587', 10),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  try {
    await getTransporter().sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px;">
          <h2>Verification Code</h2>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing: 8px; color: #e11d48;">${otp}</h1>
          <p>It expires in <strong>10 minutes</strong>.</p>
          <p style="color: #6b7280; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('[EmailService] Failed to send OTP email:', error);
  }
}
