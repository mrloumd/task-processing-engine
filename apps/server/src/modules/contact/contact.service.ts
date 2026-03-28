import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  async send(dto: ContactDto): Promise<void> {
    const { name, email, subject, message } = dto;

    try {
      await this.transporter.sendMail({
        from: `"QueueWorks Contact" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        replyTo: email,
        subject: `[QueueWorks] ${subject}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#040e0e;color:#f8fafc;padding:32px;border-radius:12px;border:1px solid rgba(255,255,255,0.08)">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px">
              <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#1e9aa0,#167a7f);display:flex;align-items:center;justify-content:center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/><path d="M12 8v4l3 3"/></svg>
              </div>
              <span style="font-weight:600;font-size:16px;color:#fff">QueueWorks</span>
            </div>
            <h2 style="margin:0 0 24px;font-size:18px;color:#27b5bc">New message from contact form</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:10px 0;color:#94a3b8;font-size:13px;width:90px">Name</td>
                <td style="padding:10px 0;font-size:14px">${name}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#94a3b8;font-size:13px">Email</td>
                <td style="padding:10px 0;font-size:14px"><a href="mailto:${email}" style="color:#27b5bc">${email}</a></td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#94a3b8;font-size:13px">Subject</td>
                <td style="padding:10px 0;font-size:14px">${subject}</td>
              </tr>
            </table>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:20px 0"/>
            <p style="color:#94a3b8;font-size:13px;margin:0 0 8px">Message</p>
            <p style="font-size:14px;line-height:1.7;white-space:pre-wrap;margin:0">${message}</p>
          </div>
        `,
      });
    } catch (err) {
      console.error('[ContactService] Failed to send email:', err);
      throw new InternalServerErrorException(
        'Failed to send message. Please try again.',
      );
    }
  }
}
