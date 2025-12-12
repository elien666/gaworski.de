# gaworski.de

Personal website and portfolio for **Björn Gaworski-Dammann** - Product & Solution Designer specializing in Product Rescue & Acceleration.

🌐 **Live Site:** [gaworski.de](https://gaworski.de)

## About

This is the source code for my personal marketing website, showcasing my expertise in rescuing stalled product initiatives and accelerating high-stakes software projects. The site highlights my 6-Week Product Rescue Sprint service and demonstrates my approach to product strategy and solution design.

## Connect

- **LinkedIn:** [linkedin.com/in/gaworski](https://linkedin.com/in/gaworski)
- **Email:** bjoern@gaworski.de

## Repository Status

This is a **public repository** for transparency and code visibility. While the code is open for viewing and learning, this is a personal project and I'm not actively seeking collaborators or contributions. Feel free to browse the code, learn from it, or use it as inspiration for your own projects.

## Tech Stack

- **[Astro](https://astro.build)** v5.16.5 - Static site generator for optimal performance
- **[Tailwind CSS](https://tailwindcss.com)** v4.1.18 - Utility-first CSS framework
- **[DaisyUI](https://daisyui.com)** v5.5.13 - Component library for Tailwind CSS
- **TypeScript** - Type-safe development

## Project Structure

```
/
├── public/          # Static assets (favicon, etc.)
├── src/
│   ├── assets/      # Optimized images (headshots, logos)
│   ├── components/  # Reusable Astro components
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── Services.astro
│   │   ├── TheMethod.astro
│   │   ├── About.astro
│   │   └── Contact.astro
│   ├── layouts/     # Layout components
│   │   └── Layout.astro
│   ├── pages/       # Pages/routes
│   │   └── index.astro
│   ├── scripts/     # Client-side JavaScript
│   │   └── main.js
│   └── styles/      # Global styles
│       └── global.css
├── astro.config.mjs # Astro configuration
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Development

```bash
npm install
npm run dev
```

Visit `http://localhost:4321` to see the site.

#### Environment Variables

Create a `.env` file in the root directory and add your configuration:

```bash
PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
PUBLIC_CALCOM_URL=https://cal.com/your-username/15min
```

Or manually create the file with:

```
PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
PUBLIC_CALCOM_URL=https://cal.com/your-username/15min
```

**Notes:**
- The Google Analytics tracking ID is optional. If not provided, the cookie consent banner will still appear, but analytics will not be loaded.
- The Cal.com URL is optional. If not provided, the Contact component will display a fallback email link. To get your Cal.com embed URL, go to your Cal.com dashboard → Event Types → select your event → Embed section, and copy the inline embed URL.

### Build

```bash
npm run build
```

This creates a `dist/` folder with static files ready for deployment.

### Preview Production Build

```bash
npm run preview
```

## Features

- **Zero JavaScript by default** - Optimal performance with minimal client-side JS
- **Responsive design** - Mobile-first approach with Tailwind CSS
- **Optimized images** - WebP and JPEG versions with proper sizing
- **Smooth scrolling navigation** - Anchor links with smooth scroll behavior
- **Performance optimized** - Fast loading times and Core Web Vitals compliance
- **GDPR-compliant cookie consent** - Vanilla Cookie Consent integration with Google Analytics support
- **Privacy-first analytics** - Google Analytics only loads with explicit user consent
- **Integrated booking** - Cal.com embedded calendar for direct appointment scheduling

## Development Workflow

**Pull Requests Required:** All changes must be submitted via Pull Requests (PRs) to merge into the `main` branch. Direct pushes to `main` are not allowed.

## Deployment

The website is automatically deployed when a new release is created. The deployment process:

1. Create a new release with a version tag (e.g., `v1.0`)
2. The GitHub Actions workflow will automatically:
   - Build the site
   - Deploy it to the production server

The `dist/` folder contains static files that can be deployed to any static hosting service.

## Learn More

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [DaisyUI Documentation](https://daisyui.com/docs)

---

