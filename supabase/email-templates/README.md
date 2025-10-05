# YAHAPA Email Templates

This directory contains professional email templates for Supabase authentication.

## 📧 Available Templates

### 1. **confirm-signup.html** (Main Template)
Beautiful HTML email template for new user signups with:
- ✨ YAHAPA logo header with gradient background
- 🎨 Professional styling matching app design
- 🔘 Clear call-to-action button
- 📱 Mobile-responsive layout
- 🔗 Alternative text link for accessibility
- 📋 Feature list preview
- 🔒 Security notice
- 🔗 Footer with Privacy & Terms links

### 2. **confirm-signup-text.txt** (Text Version)
Plain text fallback for email clients that don't support HTML.

### 3. **SETUP-INSTRUCTIONS.md**
Step-by-step guide to implement the templates in Supabase.

## 🚀 Quick Setup

1. **Open Supabase Dashboard**
   - Go to your project → Authentication → Email Templates

2. **Edit "Confirm signup" Template**
   - Copy contents from `confirm-signup.html`
   - Paste into Supabase template editor
   - Save changes

3. **Test**
   - Create a test account
   - Check your email
   - Verify the styling and links work

## 🎨 Email Preview

```
┌─────────────────────────────────────┐
│   [Purple Gradient Header]          │
│                                     │
│         [YAHAPA Logo]               │
│            YAHAPA                   │
│   Your Health and Productivity App  │
│                                     │
├─────────────────────────────────────┤
│                                     │
│   Welcome to YAHAPA!                │
│                                     │
│   Thank you for signing up...       │
│                                     │
│   ┌───────────────────────────┐    │
│   │  Verify Email Address     │    │
│   └───────────────────────────┘    │
│                                     │
│   If button doesn't work...         │
│   [verification link]               │
│                                     │
│   ┌───────────────────────────┐    │
│   │ Once verified, you'll be  │    │
│   │ able to:                  │    │
│   │ • Track health metrics    │    │
│   │ • Manage tasks with AI    │    │
│   │ • Build habits            │    │
│   │ • Use Pomodoro timer      │    │
│   │ • Visualize progress      │    │
│   └───────────────────────────┘    │
│                                     │
│   Security Note: Link expires...    │
│                                     │
├─────────────────────────────────────┤
│         [Footer]                    │
│   YAHAPA - Track your health...     │
│   © 2025 YAHAPA                     │
│   Privacy • Terms                   │
└─────────────────────────────────────┘
```

## 🎨 Design Features

**Colors:**
- Primary gradient: `#667eea` → `#764ba2` (purple)
- Text dark: `#1f2937`
- Text medium: `#4b5563`
- Text light: `#6b7280`
- Background: `#f3f4f6`

**Typography:**
- Font: System fonts (Apple, Segoe UI, Roboto)
- Heading: 28px bold
- Subheading: 24px semibold
- Body: 16px regular
- Footer: 12-13px

**Layout:**
- Max width: 600px
- Rounded corners: 8px
- Padding: 40px
- Box shadow for depth

## 🔧 Customization

### Change Logo
Replace the logo URL in the template:
```html
<img src="https://yahapa.vercel.app/logo.png" alt="YAHAPA Logo" width="80" height="80">
```

### Change Colors
Modify the gradient values:
```html
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Update Features List
Edit the `<ul>` section in the template to highlight different features.

### Add Social Links
Add social media icons to the footer:
```html
<a href="https://twitter.com/yahapa">Twitter</a>
<a href="https://github.com/yahapa">GitHub</a>
```

## 📝 Template Variables

Supabase provides these variables (already included in template):

- `{{ .ConfirmationURL }}` - Email verification link
- `{{ .Token }}` - Verification token
- `{{ .TokenHash }}` - Token hash
- `{{ .SiteURL }}` - Your app URL
- `{{ .Year }}` - Current year

## ✅ Testing Checklist

- [ ] Email displays correctly in Gmail
- [ ] Email displays correctly in Outlook
- [ ] Email displays correctly on mobile
- [ ] Logo loads properly
- [ ] Verification button works
- [ ] Alternative link works
- [ ] Footer links work (Privacy, Terms)
- [ ] Text version loads if HTML fails

## 🐛 Common Issues

**Logo not showing:**
- Ensure app is deployed and logo is accessible
- Check if email client blocks external images
- Try using base64 encoded logo instead

**Styling broken:**
- Use inline styles (already done in template)
- Avoid complex CSS (gradients may not work in some clients)
- Test in multiple email clients

**Links not clickable:**
- Ensure proper href attributes
- Use full URLs (not relative paths)
- Test in plain text clients

## 📚 Resources

- [Supabase Email Templates Docs](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Email Client CSS Support](https://www.caniemail.com/)
- [HTML Email Best Practices](https://templates.mailchimp.com/development/html/)

---

**Questions?**

Check the SETUP-INSTRUCTIONS.md file for detailed implementation steps.
