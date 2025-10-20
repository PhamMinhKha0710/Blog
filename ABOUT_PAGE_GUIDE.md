# About Page Design Guide

## 🎨 Overview

The About page has been completely redesigned into a professional, modern portfolio layout that matches your Next.js portfolio design aesthetic. The design features:

- **8/12 Centered Layout**: Responsive 12-column grid system with content occupying 8 columns
- **35/65 Split Layout**: Profile (35%) on the left, content (65%) on the right
- **Smooth Animations**: Floating avatar, fade-in effects, and hover interactions
- **Modern Design**: Clean typography, elegant spacing, and professional color scheme
- **Full Responsive**: Mobile-first design that stacks beautifully on smaller screens

## 📁 Files Modified/Created

### 1. Layout Template
- **`layouts/about/single.html`** - Custom HTML template for About page

### 2. Styling
- **`assets/css/_custom/about.scss`** - Complete About page styles
- **`assets/css/_custom.scss`** - Updated to import about.scss

### 3. Content Files
- **`content/about/index.md`** (Vietnamese)
- **`content/about/index.en.md`** (English)

### 4. Translations
- **`i18n/en.toml`** - English translations
- **`i18n/vi.toml`** - Vietnamese translations

## 🎯 Key Features

### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│                 12-Column Grid                       │
│  ┌────────────── 8/12 Width ───────────────┐       │
│  │                                          │       │
│  │  ┌───────┐  ┌──────────────────────┐   │       │
│  │  │       │  │                      │   │       │
│  │  │ 35%   │  │       65%            │   │       │
│  │  │Profile│  │     Content          │   │       │
│  │  │       │  │                      │   │       │
│  │  └───────┘  └──────────────────────┘   │       │
│  │                                          │       │
│  │  ┌────── What I Do (Full Width) ──┐   │       │
│  │  ┌────── Tech Stack (Grid) ────────┐   │       │
│  │  ┌────── Contact Links ────────────┐   │       │
│  │                                          │       │
│  └──────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
```

### Sections

1. **Profile Section (Left)**
   - Avatar with floating animation
   - Glow effect on hover
   - Tagline and subtitle
   - Sticky positioning on desktop

2. **Who I Am (Right)**
   - Professional introduction
   - Conversational tone
   - Markdown content support

3. **What I Do**
   - 2-column grid of skill cards
   - Hover animations
   - Icon + title + description

4. **Tech Stack**
   - Responsive grid (auto-fit, min 120px)
   - Emoji logos with hover effects
   - Glow on hover

5. **Call to Action**
   - Optional Download CV button
   - Optional My Journey button
   - Smooth gradient buttons

6. **Contact Section**
   - Social media links
   - Email contact
   - Icon + label format

## 📝 How to Customize

### Change Profile Image

Replace the image at:
- `static/images/avatar.webp` (preferred)
- `static/images/avatar.png` (fallback)

### Update Content

Edit the frontmatter in `content/about/index.md`:

```toml
+++
title = "About Me"
tagline = "Your Tagline Here"
subtitle = "Your Subtitle Here"
resumeLink = "https://yourresume.com/cv.pdf"
showJourneyButton = true
journeyLink = "/my-journey"

[[skills]]
icon = '💻'
title = "Your Skill"
description = "Description of what you do"

[[technologies]]
name = "Technology Name"
logo = "🔧"

[[contacts]]
label = "GitHub"
url = "https://github.com/yourusername"
icon = '<svg>...</svg>'
+++

Your markdown content here...
```

### Customize Colors

The design uses CSS variables defined in `_custom.scss`:

**Light Mode:**
- `--primary-color`: #2a6df4
- `--accent-color`: #2a6df4
- `--card-background-color`: #ffffff
- `--text-color`: #333333

**Dark Mode:**
- `--primary-color`: #6f9eff
- `--accent-color`: #6f9eff
- `--card-background-color`: #252627
- `--text-color`: #e1e1e1

### Add More Skills

In the frontmatter, add:

```toml
[[skills]]
icon = '🎨'
title = "UI/UX Design"
description = "Creating beautiful user interfaces"
```

### Add More Technologies

```toml
[[technologies]]
name = "Python"
logo = "🐍"
```

### Add More Contact Links

```toml
[[contacts]]
label = "Twitter"
url = "https://twitter.com/yourhandle"
icon = '<svg width="20" height="20">...</svg>'
```

## 🎨 Design Features

### Animations

1. **Float Animation**: Avatar floats up and down gently
2. **Fade In**: Sections fade in on scroll
3. **Hover Effects**: Cards lift and glow on hover
4. **Stagger Animation**: Cards animate in sequence

### Responsive Breakpoints

- **Desktop (>1024px)**: Full side-by-side layout
- **Tablet (768px-1024px)**: 85% width, adjusted spacing
- **Mobile (<768px)**: Stacked layout, centered content

### Theme Support

The design fully supports both light and dark modes with appropriate color adjustments.

## 🚀 Performance

- **Lazy Loading**: Images load only when needed
- **CSS Animations**: GPU-accelerated transforms
- **Minimal JavaScript**: Only for scroll reveal effects
- **Optimized Rendering**: No layout shifts during load

## 🎯 SEO & Accessibility

- **Semantic HTML**: Proper heading hierarchy
- **Alt Text**: All images have descriptive alt text
- **ARIA Labels**: Accessible navigation
- **Meta Description**: From frontmatter
- **Keyboard Navigation**: Full keyboard support

## 🔧 Troubleshooting

### Avatar Not Showing

Check these locations:
1. `static/images/avatar.webp`
2. `static/images/avatar.png`
3. File permissions

### Styles Not Loading

1. Clear Hugo cache: `hugo --gc`
2. Restart Hugo server
3. Check browser console for errors

### Layout Breaking on Mobile

- Ensure viewport meta tag is present
- Check browser compatibility
- Clear browser cache

## 📚 Additional Customization

### Change Grid Width

In `about.scss`, modify:

```scss
.about-content-wrapper {
  max-width: 66.666%; // Change this (8/12 = 66.666%)
}
```

### Adjust Side-by-Side Split

In `about.scss`, modify:

```scss
.about-layout {
  grid-template-columns: 35% 65%; // Adjust these percentages
}
```

### Disable Animations

To disable all animations, add to `about.scss`:

```scss
* {
  animation: none !important;
  transition: none !important;
}
```

## 💡 Tips

1. **Keep it concise**: Write punchy, engaging copy
2. **Use emojis wisely**: They add personality but don't overdo it
3. **Update regularly**: Keep your skills and projects current
4. **Test on devices**: Check how it looks on different screens
5. **Optimize images**: Compress avatar image for faster loading

## 🎉 Result

Your About page now has:
- ✅ Modern, professional design
- ✅ Smooth animations and transitions
- ✅ Fully responsive layout
- ✅ Dark/light mode support
- ✅ Easy to customize
- ✅ Portfolio-style presentation
- ✅ Clean, readable typography
- ✅ Engaging hover effects

Enjoy your new About page! 🚀









