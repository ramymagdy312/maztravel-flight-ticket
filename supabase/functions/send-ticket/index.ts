import nodemailer from "npm:nodemailer@6.9.12";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfBase64, recipientEmail, subject } = await req.json();

    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: Deno.env.get("SMTP_HOST"),
      port: parseInt(Deno.env.get("SMTP_PORT") || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: Deno.env.get("SMTP_USERNAME"),
        pass: Deno.env.get("SMTP_PASSWORD"),
      },
    });

    // Send email with PDF attachment
    await transporter.sendMail({
      from: Deno.env.get("SMTP_FROM"),
      to: recipientEmail,
      subject: subject,
      text: "Please find your flight ticket attached to this email.",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Your Flight Ticket</h2>
          <p>Thank you for booking with us. Your flight ticket is attached to this email.</p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <br>
          <p style="color: #666;">Best regards,</p>
          <p style="color: #666;">MAZ Travel Team</p>
        </div>
      `,
      attachments: [
        {
          filename: "ticket.pdf",
          content: pdfBase64,
          encoding: "base64",
        },
      ],
    });

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});