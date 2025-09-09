# Email Setup Guide

## Email Service Configuration

The application supports multiple email services. Choose one and configure it properly.

### 1. Resend API (Recommended)

Resend is a modern email API that's easy to set up and reliable.

**Setup:**
1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add to your environment variables:

```bash
VITE_EMAIL_SERVICE=resend
VITE_RESEND_API_KEY=re_your_api_key_here
```

**Advantages:**
- Reliable delivery
- Easy setup
- Good free tier
- Modern API

### 2. EmailJS

EmailJS allows sending emails directly from the frontend.

**Setup:**
1. Sign up at [emailjs.com](https://emailjs.com)
2. Create a service (Gmail recommended)
3. Create an email template
4. Get your User ID
5. Add to your environment variables:

```bash
VITE_EMAIL_SERVICE=emailjs
VITE_EMAILJS_SERVICE_ID=gmail
VITE_EMAILJS_TEMPLATE_ID=template_emrs
VITE_EMAILJS_USER_ID=your_user_id_here
VITE_GMAIL_USER=your_gmail@gmail.com
VITE_GMAIL_PASS=your_gmail_app_password
```

**Note:** You need to create a Gmail App Password for this to work.

### 3. Gmail SMTP (Simulation Only)

Currently, Gmail SMTP is only simulated for development purposes.

```bash
VITE_EMAIL_SERVICE=gmail
VITE_GMAIL_USER=your_gmail@gmail.com
VITE_GMAIL_PASS=your_gmail_app_password
```

### 4. Custom SMTP

For custom SMTP servers:

```bash
VITE_EMAIL_SERVICE=smtp
VITE_SMTP_HOST=smtp.your-provider.com
VITE_SMTP_PORT=587
VITE_SMTP_USER=your_username
VITE_SMTP_PASS=your_password
```

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Twilio SMS Configuration
VITE_TWILIO_ACCOUNT_SID=your_twilio_account_sid
VITE_TWILIO_AUTH_TOKEN=your_twilio_auth_token
VITE_TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Email Service Configuration
VITE_EMAIL_SERVICE=resend
VITE_RESEND_API_KEY=your_resend_api_key
```

## Testing Email Functionality

1. Go to the Admin Dashboard
2. Navigate to the Email Testing section
3. Click "Test Service" to check configuration
4. Enter a test email address and send a test email

## Troubleshooting

### Common Issues:

1. **"Email service not configured"**
   - Check that `VITE_EMAIL_SERVICE` is set
   - Verify the required API keys are provided

2. **"Failed to send email"**
   - Check API key validity
   - Verify email service configuration
   - Check browser console for detailed errors

3. **"No users found with email addresses"**
   - Ensure users have email addresses in their profiles
   - Check the database for user data

### Debug Steps:

1. Check browser console for error messages
2. Test the email service configuration
3. Verify environment variables are loaded
4. Check Supabase function logs

## Production Deployment

For production deployment:

1. Set up proper environment variables in your hosting platform
2. Use a reliable email service (Resend recommended)
3. Configure proper domain authentication
4. Set up email templates
5. Monitor email delivery rates

## Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Rotate API keys regularly
- Monitor email usage and costs
