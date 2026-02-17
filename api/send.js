// Vercel Serverless Function — sends contact form emails via Resend
// Deploy: place in /api/send.js and set RESEND_API_KEY env variable in Vercel dashboard

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email address" });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
        console.error("RESEND_API_KEY is not set");
        return res.status(500).json({ error: "Server configuration error" });
    }

    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${RESEND_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: "Portfolio Contact <onboarding@resend.dev>",
                to: "taiye.aisekhame@eng.uniben.edu",
                subject: `Portfolio Contact: ${name}`,
                reply_to: email,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">New Portfolio Message</h2>
                        <hr style="border: 1px solid #eee;" />
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Message:</strong></p>
                        <p style="background: #f9f9f9; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${message}</p>
                        <hr style="border: 1px solid #eee;" />
                        <p style="color: #999; font-size: 12px;">Sent from your portfolio contact form</p>
                    </div>
                `,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Resend API error:", data);
            return res.status(response.status).json({
                error: data.message || "Failed to send email",
            });
        }

        return res.status(200).json({ success: true, id: data.id });
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
