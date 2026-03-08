import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, organisation, enquiryType, message } = await req.json();

    // Verify SMTP configuration
    if (!process.env.SMTP_HOST) {
      console.error('SMTP_HOST is missing in environment variables.');
      return NextResponse.json({ error: 'Server configuration error (host)' }, { status: 500 });
    }
    if (!process.env.SMTP_USER) {
      console.error('SMTP_USER is missing in environment variables.');
      return NextResponse.json({ error: 'Server configuration error (user)' }, { status: 500 });
    }
    if (!process.env.SMTP_PASS) {
      console.error('SMTP_PASS is missing in environment variables.');
      return NextResponse.json({ error: 'Server configuration error (password)' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g., mail.privateemail.com
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 1. Send notification to the company
    const mailOptions = {
      from: `"Wavy Energy Web" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER,
      replyTo: email,
      subject: `New Enquiry: ${enquiryType} from ${organisation || 'N/A'}`,
      text: `
        Name: ${firstName} ${lastName}
        Email: ${email}
        Organisation: ${organisation || 'N/A'}
        Enquiry Type: ${enquiryType}
        Message: ${message}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Organisation:</strong> ${organisation || 'N/A'}</p>
        <p><strong>Enquiry Type:</strong> ${enquiryType}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // 2. Send confirmation to the client
    const confirmationOptions = {
      from: `"Wavy Energy" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'We have received your enquiry - Wavy Energy',
      text: `Hi ${firstName}, thank you for reaching out to Wavy Energy. We have received your enquiry regarding "${enquiryType}" and our team will get back to you shortly.`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #22502E;">Wavy Energy</h2>
          <p>Hi ${firstName},</p>
          <p>Thank you for reaching out to <strong>Wavy Energy Company Limited</strong>.</p>
          <p>This is to confirm that we have received your inquiry regarding <strong>${enquiryType}</strong>. Our team is currently reviewing your request and will get back to you through this email address shortly.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 0.9rem; color: #666;">
            <strong>Your Message Summary:</strong><br>
            <em>${message.length > 100 ? message.substring(0, 100) + '...' : message}</em>
          </p>
          <p style="font-size: 0.8rem; color: #999; margin-top: 30px;">
            Lagos, Nigeria &nbsp;·&nbsp; Downstream Energy &nbsp;·&nbsp; Clean Power<br>
            © 2025 Wavy Energy Company Limited. All rights reserved.
          </p>
        </div>
      `,
    };

    // Execute both sends
    await Promise.all([
      transporter.sendMail(mailOptions),
      transporter.sendMail(confirmationOptions)
    ]);

    return NextResponse.json({ message: 'Enquiry sent and confirmation delivered' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
