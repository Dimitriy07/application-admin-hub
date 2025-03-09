import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify your email",
    html: `<p>This is verification link <a href="${confirmLink}">Link</a> to confirm your email!</p>`,
  });
  if (error) console.log(error);
  return data;
}
