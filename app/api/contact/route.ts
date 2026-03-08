import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, organisation, enquiryType, message } = await req.json();

    // Verify SMTP configuration
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('SMTP credentials not found in environment variables.');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
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

    const mailOptions = {
      from: `"${firstName} ${lastName}" <${process.env.SMTP_USER}>`, // Recommended: Always use your SMTP user as from
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

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
