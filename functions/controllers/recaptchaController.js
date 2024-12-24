const fetch = require('node-fetch');
const admin = require('firebase-admin');

// Initialize Firebase
if (!admin.apps.length){
    admin.initializeApp();
}

const db = admin.firestore();

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;

exports.validateCaptcha = async ({req, res}) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.status(204).send(""); //preflight request
        return;
    }

    const { captchaToken, userId} = req.body;

    if (!captchaToken) {
        return res.status(400).json({ error: "Missing captcha token" });
    }

    try {

        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${RECAPTCHA_SECRET}&response=${captchaToken}`,
        });

        const data = await response.json();

        if (!data.success) {
            await db.collection("recaptcha_logs").add({
                userId: userId || "ananonymous",
                success: false,
                error: data['error-codes'].join(', ') || [],
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });
            return res.status(400).json({ 
                success: false,
                error: "reCAPTCHA verification failed",
                details: data['error-codes'].join(', '),
            });
        }
        await db.collection("recaptcha_logs").add({
            userId: userId || "ananonymous",
            success: true,
            score: data.score,
            action: data.action,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
        return res.status(200).json({ success: true, data });
    
    } catch (error) {
        console.error("Error validating reCAPTCHA:", error);
        return res.status(500).json({
            success: false,
            error: "Internal server error",
         });
    }
};