const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // 587 esetén false
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendWelcomeEmail = async (toEmail) => {
    await transporter.sendMail({
        from: `"Cipőbolt" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Üdvözlünk a Cipőboltunkban!",
        text: "Köszönjük a regisztrációt! Örülünk, hogy csatlakoztál hozzánk.",
        html: `
            <h2>Üdvözlünk a Cipőboltban! 👟</h2>
            <p>Köszönjük a regisztrációt!</p>
            <p>Jó vásárlást kívánunk!</p>
        `
    });
};