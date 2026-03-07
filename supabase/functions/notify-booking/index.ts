import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "dummy_resend_api_key";
const META_WA_ACCESS_TOKEN = Deno.env.get("META_WA_ACCESS_TOKEN") || "dummy_meta_token";
const META_WA_PHONE_NUMBER_ID = Deno.env.get("META_WA_PHONE_NUMBER_ID") || "dummy_phone_id";
const OWNER_PHONE_NUMBER = Deno.env.get("OWNER_PHONE_NUMBER") || "359882545355"; // MUST be without the + sign for Meta API
const OWNER_EMAIL = Deno.env.get("OWNER_EMAIL") || "owner@primetransfers.net";
const FROM_EMAIL = "bookings@primetransfers.net";

interface Booking {
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

const formatBookingDetails = (booking: Booking): string => {
  return `Customer details:
- first name: ${booking.first_name || 'N/A'}
- last name: ${booking.last_name || 'N/A'}
- phone: ${booking.phone || 'N/A'}
- email: ${booking.email || 'N/A'}

Trip details:
- pickup location: ${booking.pickup_location || 'N/A'}
- pickup time: ${booking.pickup_time || 'N/A'}
- destination: ${booking.dropoff_location || 'N/A'}
- trip date: ${booking.pickup_date || 'N/A'}
- return date (if any): ${booking.return_date || 'N/A'}
- return time (if any): ${booking.return_time || 'N/A'}
- passengers number: ${booking.passengers || 'N/A'}
- everything written in the special requests & details section: ${booking.special_requests || 'N/A'}

Vehicle details:
- vehicle type: ${booking.vehicle_type || 'Selected Vehicle'}
- price per km: N/A
- total distance: N/A
- total price: ${booking.price || 'N/A'}`;
};

async function sendEmail(to: string, subject: string, text: string) {
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

serve(async (req) => {
  try {
    const payload = await req.json();
    console.log("Webhook payload:", payload);

    if (payload.type === 'INSERT') {
      const b: Booking = payload.record;
      const details = formatBookingDetails(b);

      // 1. Customer Booking Confirmation Request Email
      if (b.email) {
        await sendEmail(b.email, "Action Required: Please Confirm Your Prime Transfers Booking", `Hello ${b.first_name},\n\nPlease review your booking details and confirm your reservation:\n\n${details}`);
      }

      // 3. Owner Email Notification
      await sendEmail(OWNER_EMAIL, "New Booking Received!", `A new booking has been submitted:\n\n${details}`);

      // 4. WhatsApp Owner Notification
      await sendWhatsApp(OWNER_PHONE_NUMBER, `New Booking Received!\n\n${details}`);

    } else if (payload.type === 'UPDATE') {
      const oldRec: Booking = payload.old_record || {} as Booking;
      const newRec: Booking = payload.record;

      // 2. Customer Final Booking Confirmation Email
      if (oldRec.status !== 'confirmed' && newRec.status === 'confirmed') {
        if (newRec.email) {
          const details = formatBookingDetails(newRec);
          const contactInfo = `\n\nCompany Contact Information:\nPhone: +359 88 254 5355\nEmail: bookings@primetransfers.net\nPrime Transfers`;
          await sendEmail(newRec.email, "Booking Confirmed: Prime Transfers", `Hello ${newRec.first_name},\n\nYour booking is fully confirmed! Here are your details:\n\n${details}${contactInfo}`);
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.log("Error processing webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
})
