# Email Template Setup Instructions

## How to Update Supabase Email Templates

Follow these steps to apply the custom email template to your Supabase project:

### 1. Access Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your YAHAPA project
3. Click on **Authentication** in the left sidebar
4. Click on **Email Templates**

### 2. Update the "Confirm signup" Template

1. In the Email Templates section, find **"Confirm signup"**
2. Click to edit it
3. Copy the entire contents of `confirm-signup.html` from this directory
4. Paste it into the template editor, replacing the default template
5. Click **Save** at the bottom

### 3. Template Variables

The template uses the following Supabase variables (already included):

- `{{ .ConfirmationURL }}` - The verification link
- `{{ .Year }}` - Current year (optional, can be replaced with static year)

### 4. Optional: Customize Other Templates

You can also customize these email templates using similar styling:

- **Invite user** - When inviting users to your app
- **Magic Link** - For passwordless login
- **Reset Password** - Password reset emails
- **Change Email Address** - Email change confirmation

### 5. Test the Email

1. Create a new account on your app
2. Check the email inbox
3. Verify the email looks professional and all links work

## Template Features

✅ **Professional Design**
- Clean, modern layout
- YAHAPA logo prominently displayed
- Gradient header matching app theme
- Responsive design for mobile and desktop

✅ **Clear Call-to-Action**
- Large, visible verification button
- Alternative text link for accessibility
- 24-hour expiration notice

✅ **Branding**
- App features preview
- Privacy and Terms links in footer
- Consistent color scheme with app

✅ **Security**
- Clear security note
- Expiration warning
- "Ignore if not you" message

## Troubleshooting

**Issue: Logo not displaying**
- Make sure your app is deployed and accessible at https://yahapa.vercel.app/
- Verify the logo.png file exists in the public folder
- Check email client allows external images

**Issue: Template variables not working**
- Ensure you're using the exact syntax: `{{ .VariableName }}`
- Don't modify the variable names

**Issue: Styling not rendering**
- Some email clients strip certain CSS
- The template uses inline styles for maximum compatibility
- Test in multiple email clients (Gmail, Outlook, Apple Mail)

## Additional Customization

To further customize the template:

1. **Change Colors**: Modify the gradient values in `background: linear-gradient(...)`
2. **Update Logo**: Replace the logo URL or add a different image
3. **Add Social Links**: Include social media icons in the footer
4. **Modify Features List**: Update the benefits list to highlight different features
5. **Change Font**: Modify the font-family in the body style

## Email Preview

The email will display:
- YAHAPA logo (80x80px, rounded)
- Purple gradient header
- Welcome message
- Verification button (purple gradient)
- Alternative text link
- Feature list preview
- Security note
- Footer with links to Privacy Policy and Terms

---

**Need Help?**

If you encounter any issues setting up the email template, check the Supabase documentation:
- [Email Templates Guide](https://supabase.com/docs/guides/auth/auth-email-templates)
- [SMTP Configuration](https://supabase.com/docs/guides/auth/auth-smtp)
