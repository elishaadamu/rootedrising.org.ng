# Rooted Rising Initiative Admin Panel Documentation

> **Version**: 1.0  
> **Last Updated**: March 2026  
> **Built With**: Next.js 16, Prisma ORM, PostgreSQL

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Dashboard Overview](#dashboard-overview)
4. [Feature Guide](#feature-guide)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing the Admin Panel

1. Navigate to `/admin` from the main site
2. Log in with your admin credentials
3. If you don't have credentials, contact the system administrator

### First-Time Setup

When a new team member is added:
- An admin account is automatically created with email provided
- Default password: `password`
- **Important**: Change your password immediately after first login via **Settings → Password**

---

## Authentication

### How It Works

- Sessions use JWT tokens stored in secure HTTP-only cookies
- Session duration: **24 hours**
- After expiration, you'll be redirected to the login page

### User Roles

| Role | Access Level |
|------|-------------|
| **ADMIN** | Full access to all admin features |
| **USER** | Limited access (ambassadors only) |

### Security Notes

- Never share your admin credentials
- Always log out when finished
- Use strong passwords (minimum 6 characters)
- Enable two-factor authentication on your email account

---

## Dashboard Overview

### Location: `/admin`

The dashboard provides a quick snapshot of your platform:

**Metrics Displayed**:
- Total Users (Ambassadors + Staff)
- Published Blog Posts
- Newsletter Subscribers
- Total Comments

**Recent Activity**:
- Last 5 newsletter subscribers
- Last 5 blog comments
- Last 6 registered users

---

## Feature Guide

### 1. User Management

**Location**: `/admin/users`

**What You Can Do**:
- View all registered users
- See user roles (ADMIN/USER)
- Check registration dates
- Monitor user count

**Tips**:
- Users are automatically created when team members are added
- Ambassadors can register via the opportunities page

---

### 2. Blog Management

**Location**: `/admin/blog`

#### Creating a New Post

1. Click **"New Post"** button
2. Fill in the form:
   - **Title**: Clear, engaging headline
   - **Excerpt**: 1-2 sentence summary (appears in blog listings)
   - **Content**: Full article using the rich text editor
   - **Cover Image**: Upload via Cloudinary (max 5MB)
   - **Section**: Choose category (Story, Strategy, Insight, Report, News)
   - **Status**: Publish immediately or save as Draft

3. **AI Refinement** (Optional):
   - Click "Refine with AI" to polish content
   - Reviews grammar, clarity, and tone
   - Always review AI suggestions before accepting

4. Click **"Create Post"** to publish

#### Editing a Post

1. Find the post in the blog list
2. Click the **Edit** icon
3. Make your changes
4. Click **"Update Post"**

#### Deleting a Post

1. Click the **Delete** button on the post card
2. Confirm deletion in the dialog
3. Post is permanently removed

**Best Practices**:
- Use high-quality images (1200x630px recommended)
- Write excerpts under 150 characters
- Categorize posts correctly for better organization
- Preview before publishing

---

### 3. Team Management

**Location**: `/admin/team`

#### Adding a Team Member

1. Click **"Add Team Member"**
2. Fill in details:
   - **Name**: Full name
   - **Role**: Job title/position
   - **Bio**: Background description (use AI assist if needed)
   - **Photo**: Professional headshot via Cloudinary
   - **Email**: Public contact email (creates admin account if new)
   - **Social Links**: LinkedIn, Facebook, Instagram
   - **Display Order**: Number for sorting (1 = first)

3. **AI Bio Generation** (Optional):
   - Click "Generate Bio with AI"
   - Provide key points about the person
   - AI creates a professional bio

4. Click **"Create Team Member"**

**Important**: If you provide an email, the system automatically:
- Creates an ADMIN user account
- Sends a welcome email with credentials
- Default password: `password`

#### Editing/Deleting

- Click **Edit** to update information
- Click **Delete** to remove (requires confirmation)

---

### 4. Testimonial Management

**Location**: `/admin/testimonials`

#### Adding a Testimonial

1. Click **"Add Testimonial"**
2. Fill in:
   - **Name**: Person's full name
   - **Role**: Their position/title
   - **Content**: The testimonial text (use quotes)
   - **Photo**: Headshot via Cloudinary
   - **Rating**: 1-5 stars
   - **Status**: Active or Hidden

3. Click **"Create Testimonial"**

#### Tips:
- Get written permission before posting testimonials
- Use authentic photos when possible
- Keep testimonials concise (2-4 sentences)
- Hide testimonials temporarily instead of deleting

---

### 5. Comment Moderation

**Location**: `/admin/comments`

**What You Can Do**:
- View all user comments on blog posts
- Read star ratings and feedback
- Edit inappropriate comments
- Delete spam or offensive content
- Link to the associated blog post

**Moderation Guidelines**:
- Remove spam, hate speech, or promotional content
- Edit typos but preserve meaning
- Respond to legitimate concerns when appropriate
- Delete comments that violate community guidelines

---

### 6. Newsletter Subscribers

**Location**: `/admin/subscribers`

**What You Can Do**:
- View all subscribed email addresses
- See subscription dates
- Remove subscribers (bounce backs, unsubscribes)

**Notes**:
- Users subscribe via the footer form
- Subscribers receive email campaigns
- Don't manually add emails without consent

---

### 7. Email Campaigns

**Location**: `/admin/campaigns`

#### Sending a Campaign

1. Click **"New Campaign"**
2. Choose a template:
   - **Latest Blog Update**: Share new posts
   - **Monthly Impact Digest**: Summary of activities
   - **Ambassador Recruitment**: Call for volunteers
   - **Community Spotlight**: Feature a member
   - **Action Alert**: Urgent calls to action

3. Fill in:
   - **Subject Line**: Compelling, under 50 characters
   - **Message**: Email content (plain text, use line breaks)

4. **Preview** on mobile/desktop

5. Click **"Send Campaign"**
   - Sends to ALL subscribers
   - Cannot be undone
   - Records in campaign history

#### Campaign History

View past campaigns with:
- Subject line
- Template used
- Number of recipients
- Send date

**Best Practices**:
- Send campaigns during business hours (Tue-Thu, 10am-2pm)
- Limit to 1-2 campaigns per month
- Proofread carefully before sending
- Use engaging subject lines
- Include clear call-to-action

---

### 8. Security Settings

**Location**: `/admin/settings/password`

#### Changing Your Password

1. Enter **Current Password**
2. Enter **New Password** (min 6 characters)
3. **Confirm New Password**
4. Click **"Change Password"**

**Requirements**:
- Minimum 6 characters
- Must match confirmation
- Different from current password

**Tips**:
- Use a mix of letters, numbers, and symbols
- Change password every 90 days
- Never reuse old passwords

---

### 9. Activity Logs

**Location**: `/admin/logs`

**What's Tracked**:
- All CREATE, UPDATE, DELETE actions
- Login/logout events
- Which admin performed the action
- Timestamp of each action

**Filtering Options**:
- Search by username or email
- Filter by action type (Created, Updated, Deleted)
- Filter by entity (Post, TeamMember, Comment, etc.)
- Manual refresh button

**Use Cases**:
- Audit trail for compliance
- Troubleshooting issues
- Monitoring admin activity
- Security investigations

---

## Best Practices

### Content Management

✅ **DO**:
- Preview all content before publishing
- Use consistent formatting and tone
- Optimize images before upload (compress, correct dimensions)
- Categorize blog posts correctly
- Write clear, descriptive titles
- Add alt text to images for accessibility
- Save drafts before publishing

❌ **DON'T**:
- Publish without proofreading
- Use low-quality or copyrighted images
- Write overly long excerpts
- Delete content without confirmation
- Share unpublished drafts publicly

### Email Campaigns

✅ **DO**:
- Test subject lines with A/B testing
- Send at optimal times (Tuesday-Thursday mornings)
- Include unsubscribe option
- Personalize when possible
- Track open rates and engagement

❌ **DON'T**:
- Send too frequently (max 2/month)
- Use spammy language ("FREE", "ACT NOW")
- Send without mobile preview
- Forget to include contact information

### Security

✅ **DO**:
- Log out after each session
- Use strong, unique passwords
- Enable 2FA on your email
- Monitor activity logs regularly
- Report suspicious activity immediately

❌ **DON'T**:
- Share admin credentials
- Leave sessions open on shared computers
- Use public Wi-Fi for admin tasks
- Ignore security warnings

---

## Troubleshooting

### Common Issues

#### "Unauthorized" Error

**Cause**: Session expired or invalid role

**Solution**:
1. Log out completely
2. Clear browser cache
3. Log in again
4. Contact admin if issue persists

#### Image Upload Fails

**Possible Causes**:
- File too large (max 5MB)
- Unsupported format
- Cloudinary credentials misconfigured

**Solution**:
1. Check file size
2. Convert to JPG or PNG
3. Compress image using tools like TinyPNG
4. Contact tech admin if issue continues

#### Email Campaign Not Sending

**Possible Causes**:
- SMTP credentials incorrect
- Email service limit reached
- Invalid subscriber emails

**Solution**:
1. Check SMTP settings in `.env.local`
2. Verify Gmail app password is valid
3. Remove invalid subscriber emails
4. Check Gmail sending limits (500/day for Gmail)

#### AI Features Not Working

**Cause**: Missing or invalid Gemini API key

**Solution**:
1. Verify `NEXT_PUBLIC_GEMINI_API_KEY` in `.env.local`
2. Check API key is active on Google AI Studio
3. Ensure API quota hasn't been exceeded

#### Database Connection Error

**Cause**: PostgreSQL not running or credentials wrong

**Solution**:
1. Check DATABASE_URL in `.env.local`
2. Verify PostgreSQL service is running
3. Confirm database exists
4. Run `npx prisma generate` to regenerate client

### Getting Help

For technical issues, contact:
- **System Administrator**: Check activity logs for admin contact
- **GitHub Repository**: Review issues and documentation
- **Error Logs**: Check `/admin/logs` for recent errors

---

## Quick Reference

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Save Draft | Ctrl/Cmd + S |
| Publish | Ctrl/Cmd + Enter |
| Search | Ctrl/Cmd + K |
| Logout | Ctrl/Cmd + Shift + Q |

### File Upload Limits

| Type | Max Size |
|------|----------|
| Images | 5 MB |
| Supported Formats | JPG, PNG, WEBP |

### Sending Limits

| Service | Limit |
|---------|-------|
| Gmail SMTP | 500 emails/day |
| Campaign Frequency | Max 2/week recommended |

### Session Info

| Setting | Value |
|---------|-------|
| Session Duration | 24 hours |
| Auto-logout | On browser close |
| Concurrent Sessions | Unlimited |

---

## Appendix: Database Schema

### Key Models

```
User
├── id
├── name
├── email (unique)
├── password (hashed)
├── role (ADMIN/USER)
└── createdAt

Post
├── id
├── title
├── slug (unique)
├── excerpt
├── content (HTML)
├── image
├── section
├── published (boolean)
└── authorId

Comment
├── id
├── content
├── rating (1-5)
├── postId
├── userId (optional)
└── guestName (if not logged in)

TeamMember
├── id
├── name
├── role
├── bio
├── image
├── email (public)
├── linkedin, facebook, instagram
└── displayOrder

Testimonial
├── id
├── name
├── role
├── content
├── image
├── rating (1-5)
└── active (boolean)

Newsletter
├── id
├── email (unique)
└── createdAt

Campaign
├── id
├── subject
├── message
├── template
├── recipientCount
└── sentAt

ActivityLog
├── id
├── action
├── entity
├── entityId
├── userId
├── details
└── timestamp
```

---

## Changelog

### Version 1.0 (March 2026)
- Initial admin panel release
- Blog management with AI assistance
- Team member management
- Testimonial system
- Comment moderation
- Newsletter & campaigns
- Activity logging
- Cloudinary integration
- Mobile-responsive design

---

**Need to update this documentation?**  
Edit `/content/ADMIN_DOCUMENTATION.md` and commit changes.
