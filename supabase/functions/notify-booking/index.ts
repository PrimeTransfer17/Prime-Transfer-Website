import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
// We use the anon key or service role key if available. Webhooks usually provide Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "dummy_resend_api_key";
const META_WA_ACCESS_TOKEN = Deno.env.get("META_WA_ACCESS_TOKEN") || "dummy_meta_token";
const META_WA_PHONE_NUMBER_ID = Deno.env.get("META_WA_PHONE_NUMBER_ID") || "dummy_phone_id";
const OWNER_PHONE_NUMBER = Deno.env.get("OWNER_PHONE_NUMBER") || "359882545355"; // MUST be without the + sign for Meta API
const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL") || "transprime17@gmail.com";
const FROM_EMAIL = "bookings@primetransfers.net";

interface Booking {
  id: string | number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  pickup_location: string;
  pickup_time: string;
  pickup_date: string;
  dropoff_location: string;
  return_date?: string;
  return_time?: string;
  passengers: number;
  special_requests?: string;
  vehicle_type?: string;
  distance?: number;
  price: number;
  status: string;
}

const formatBookingDetailsText = (booking: Booking): string => {
  let details = `Customer details:
- first name: ${booking.first_name || 'N/A'}
- last name: ${booking.last_name || 'N/A'}
- phone: ${booking.phone || 'N/A'}
- email: ${booking.email || 'N/A'}

Trip details:
- pickup location: ${booking.pickup_location || 'N/A'}
- pickup time: ${booking.pickup_time || 'N/A'}
- destination: ${booking.dropoff_location || 'N/A'}
- trip date: ${booking.pickup_date || 'N/A'}\n`;

  if (booking.return_date && booking.return_time) {
    details += `- return date: ${booking.return_date}\n- return time: ${booking.return_time}\n`;
  }

  details += `- passengers number: ${booking.passengers || 'N/A'}
- everything written in the special requests & details section: ${booking.special_requests || 'N/A'}

Vehicle details:
- vehicle type: ${booking.vehicle_type || 'Selected Vehicle'}
- price per km: N/A
- total distance: N/A
- total price: ${booking.price || 'N/A'}`;

  return details;
};

type RecipientType = 'CUSTOMER' | 'OWNER';

const getHtmlTemplate = (booking: Booking, type: 'CONFIRM' | 'SUCCESS', recipientType: RecipientType, confirmUrl?: string) => {
  const isSuccess = type === 'SUCCESS';
  const isOwner = recipientType === 'OWNER';

  const statusText = isSuccess ? 'CONFIRMED' : 'ACTION REQUIRED';
  const statusBg = isSuccess ? '#e6fcf5' : '#fff4e6';
  const statusColor = isSuccess ? '#0ca678' : '#fd7e14';

  let title = '';
  let subtitle = '';

  if (isOwner) {
    title = 'New Confirmed Booking Received!';
    subtitle = `Operational Notification: A new transfer booking has been confirmed for ${booking.first_name} ${booking.last_name}. Please review the logistics below.`;
  } else {
    title = isSuccess ? 'Your Booking is Confirmed!' : 'Please Confirm Your Booking';
    subtitle = isSuccess
      ? `Hi ${booking.first_name}, Great news! Your professional transfer is all set. Thank you for choosing Prime Transfers for your journey! We've included the details below for your reference.`
      : `Hi ${booking.first_name}, We've received your transfer request. Please review the details below and click the confirm button to finalize your reservation.`;
  }

  const confirmBtnRow = !isSuccess && confirmUrl ? `
    <tr>
        <td align="center" style="padding-top: 32px; padding-bottom: 8px;">
            <a href="${confirmUrl}" style="display: inline-block; padding: 16px 36px; background: #FF5A00; color: white; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 14px rgba(255, 90, 0, 0.3);">Confirm My Booking</a>
        </td>
    </tr>
  ` : '';

  const specialRequests = booking.special_requests || 'None specified';

  return `
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f9fc; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <tr>
            <td align="center">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.04);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background: #111214; padding: 40px 20px;">
                            <img src="https://primetransfers.net/logo.png" alt="Prime Transfers" height="50" style="display: block;">
                        </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="padding-bottom: 24px;">
                                        <span style="display: inline-block; padding: 6px 14px; border-radius: 99px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; background: ${statusBg}; color: ${statusColor};">${statusText}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-size: 28px; font-weight: 800; color: #111214; padding-bottom: 12px; letter-spacing: -0.5px;">${title}</td>
                                </tr>
                                <tr>
                                    <td style="font-size: 16px; line-height: 1.6; color: #64748b; padding-bottom: 32px;">${subtitle}</td>
                                </tr>
                                <!-- Customer Details -->
                                <tr>
                                    <td style="padding-bottom: 32px;">
                                        <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px; padding-bottom: 12px;">Customer Details</div>
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td width="50%" valign="top">
                                                    <div style="font-size: 13px; font-weight: 700; color: #1e293b;">${booking.first_name} ${booking.last_name}</div>
                                                    <div style="font-size: 13px; color: #64748b; padding-top: 4px;">Passenger</div>
                                                </td>
                                                <td width="50%" valign="top">
                                                    <div style="font-size: 13px; color: #1e293b; font-weight: 600;">${booking.phone}</div>
                                                    <div style="font-size: 13px; color: #64748b; padding-top: 4px;">${booking.email}</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- Route Summary -->
                                <tr>
                                    <td style="background: #f8fafc; border: 1px solid #edf2f7; border-radius: 16px; padding: 24px;">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td width="30" valign="top"><div style="width: 12px; height: 12px; border-radius: 50%; background: #FF5A00; border: 3px solid #ffccb3; margin-top: 4px;"></div></td>
                                                <td>
                                                    <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: 800; letter-spacing: 0.8px; padding-bottom: 4px;">Pickup Location</div>
                                                    <div style="font-size: 15px; font-weight: 600; color: #1e293b;">${booking.pickup_location}</div>
                                                </td>
                                            </tr>
                                            <tr><td height="12"></td><td style="border-left: 2px dashed #e2e8f0; margin-left: 14px; height: 12px;"></td></tr>
                                            <tr>
                                                <td width="30" valign="top"><div style="width: 12px; height: 12px; border-radius: 50%; background: #111214; border: 3px solid #cbd5e1; margin-top: 4px;"></div></td>
                                                <td>
                                                    <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: 800; letter-spacing: 0.8px; padding-bottom: 4px;">Destination</div>
                                                    <div style="font-size: 15px; font-weight: 600; color: #1e293b;">${booking.dropoff_location}</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                ${booking.return_date && booking.return_time ? `
                                <tr><td height="16"></td></tr>
                                <tr>
                                    <td style="background: #fdf2f2; border: 1px solid #fee2e2; border-radius: 16px; padding: 24px;">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td width="30" valign="top"><div style="width: 12px; height: 12px; border-radius: 50%; background: #ef4444; border: 3px solid #fecaca; margin-top: 4px;"></div></td>
                                                <td>
                                                    <div style="font-size: 10px; color: #991b1b; text-transform: uppercase; font-weight: 800; letter-spacing: 0.8px; padding-bottom: 4px;">Return Details</div>
                                                    <div style="font-size: 15px; font-weight: 700; color: #1e293b;">${booking.return_date} @ ${booking.return_time}</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                ` : ''}
                                <tr><td height="32"></td></tr>
                                <!-- Trip Details Grid -->
                                <tr>
                                    <td>
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td width="50%" valign="top">
                                                    <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px; padding-bottom: 6px;">Date & Time</div>
                                                    <div style="font-size: 15px; font-weight: 600; color: #1e293b;">${booking.pickup_date}, ${booking.pickup_time}</div>
                                                </td>
                                                <td width="50%" valign="top">
                                                    <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px; padding-bottom: 6px;">Passengers</div>
                                                    <div style="font-size: 15px; font-weight: 600; color: #1e293b;">${booking.passengers} Passengers</div>
                                                </td>
                                            </tr>
                                            <tr><td height="24"></td></tr>
                                            <tr>
                                                <td width="50%" valign="top">
                                                    <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px; padding-bottom: 6px;">Vehicle Class</div>
                                                    <div style="font-size: 15px; font-weight: 600; color: #1e293b;">${booking.vehicle_type || 'Premium Transfer'}</div>
                                                </td>
                                                <td width="50%" valign="top">
                                                    <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px; padding-bottom: 6px;">Total Price</div>
                                                    <div style="font-size: 20px; font-weight: 800; color: #FF5A00;">€${booking.price}</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                ${confirmBtnRow}
                                <!-- Special Requests -->
                                <tr>
                                    <td style="padding-top: 32px; border-top: 1px solid #f1f5f9; margin-top: 32px;">
                                        <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px; padding-bottom: 12px;">Included Special Requests</div>
                                        <div style="font-size: 14px; color: #475569; background: #f8fafc; padding: 20px; border-radius: 12px; line-height: 1.6;">${specialRequests}</div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background: #f8fafc; padding: 40px; color: #94a3b8; font-size: 13px; border-top: 1px solid #f1f5f9;">
                            <div style="font-weight: 800; color: #1e293b; padding-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Prime Transfers</div>
                            <div style="padding-bottom: 24px;">Reliable Airport & City Transfers</div>
                            <div style="width: 40px; border-top: 2px solid #e2e8f0; margin-bottom: 24px;"></div>
                            <table border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="padding-right: 20px;"><img src="https://primetransfers.net/favicon.png" width="20" style="opacity: 0.5;"></td>
                                    <td align="left">
                                        <div style="font-size: 12px; color: #64748b;">Phone: +359 88 254 5355</div>
                                        <div style="font-size: 12px; color: #64748b;">Email: transprime17@gmail.com</div>
                                    </td>
                                </tr>
                            </table>
                            <div style="padding-top: 32px;">
                                <a href="https://www.instagram.com/primetrans17/" style="color: #FF5A00; text-decoration: none; font-weight: 700;">Instagram</a> &nbsp;&bull;&nbsp; 
                                <a href="https://wa.me/359882545355" style="color: #64748b; text-decoration: none; font-weight: 700;">WhatsApp</a>
                            </div>
                        </td>
                    </tr>
                </table>
                <p style="padding-top: 24px; font-size: 11px; color: #94a3b8;">&copy; ${new Date().getFullYear()} Prime Transfers. All rights reserved.</p>
            </td>
        </tr>
    </table>
  `;
};

async function sendEmail(to: string, subject: string, html: string, text: string) {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: to,
        subject: subject,
        html: html,
        text: text,
      }),
    });
    console.log(`Email to ${to} sent with status ${res.status}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

async function sendWhatsApp(to: string, text: string) {
  try {
    const url = `https://graph.facebook.com/v19.0/${META_WA_PHONE_NUMBER_ID}/messages`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${META_WA_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: to,
        type: "text",
        text: {
          preview_url: false,
          body: text
        }
      }),
    });
    console.log(`WhatsApp to ${to} sent with status ${res.status}`);
    const resBody = await res.json();
    console.log("WhatsApp Response:", resBody);
  } catch (error) {
    console.error("Error sending WhatsApp:", error);
  }
}

Deno.serve(async (req) => {
  try {
    // Handle GET Request (Customer clicks confirmation link)
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const confirmId = url.searchParams.get('confirm');
      console.log(`GET request received for confirmation ID: ${confirmId}`);

      if (confirmId) {
        console.log(`Attempting to confirm booking: ${confirmId}`);
        const { data, error } = await supabase
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('id', confirmId)
          .select();

        if (error || !data || data.length === 0) {
          console.error("Error confirming booking:", error || "No booking found");
          return new Response("Invalid confirmation link.", { status: 400 });
        }

        const confirmedBooking: Booking = data[0];
        console.log(`Booking ${confirmId} confirmed successfully. Sending notifications...`);

        const textDetails = formatBookingDetailsText(confirmedBooking);
        const htmlCustomer = getHtmlTemplate(confirmedBooking, 'SUCCESS', 'CUSTOMER');
        const htmlOwner = getHtmlTemplate(confirmedBooking, 'SUCCESS', 'OWNER');

        // 1. Notify Customer (Final Confirmation)
        if (confirmedBooking.email) {
          await sendEmail(
            confirmedBooking.email,
            "Booking Confirmed: Prime Transfers",
            htmlCustomer,
            `Hello ${confirmedBooking.first_name},\n\nYour booking is fully confirmed! Here are your details:\n\n${textDetails}`
          );
        }

        // 2. Notify Owner via Email
        await sendEmail(
          OWNER_EMAIL,
          "New Confirmed Booking Received!",
          htmlOwner,
          `A new booking has been confirmed by the customer:\n\n${textDetails}`
        );

        // 3. Notify Owner via WhatsApp
        await sendWhatsApp(OWNER_PHONE_NUMBER, `New Confirmed Booking!\n\n${textDetails}`);

        // REDIRECT to website
        return new Response(null, {
          status: 303,
          headers: {
            "Location": "https://primetransfers.net?confirmed=true",
            "Cache-Control": "no-cache, no-store, must-revalidate"
          }
        });
      }
      return new Response("Invalid confirmation link.", { status: 400 });
    }

    // Handle POST Request (Database Webhook from Supabase)
    const payload = await req.json();
    console.log("Webhook payload received:", payload.type, "for ID:", payload.record?.id);

    if (payload.type === 'INSERT') {
      const b: Booking = payload.record;
      const textDetails = formatBookingDetailsText(b);

      // 1. Customer Booking Confirmation Request Email
      if (b.email) {
        const cleanUrl = SUPABASE_URL.replace(/\/$/, '');
        const confirmUrl = `${cleanUrl}/functions/v1/notify-booking?confirm=${b.id}`;
        const htmlTemplate = getHtmlTemplate(b, 'CONFIRM', 'CUSTOMER', confirmUrl);

        await sendEmail(
          b.email,
          "Action Required: Please Confirm Your Prime Transfers Booking",
          htmlTemplate,
          `Hello ${b.first_name},\n\nPlease review your booking details and click the link below to confirm your reservation:\n\n${confirmUrl}\n\n${textDetails}`
        );
      }
    } else if (payload.type === 'UPDATE') {
      console.log("UPDATE payload received. Skipping as notifications are handled by direct GET response.");
    }

    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Critical Error in Function:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
})

