# gaworski.de - Personal Marketing, CV and Portfolio

A simple static website built with Astro, Tailwind CSS, and DaisyUI.

## Tech Stack

- **Astro** v5.16.5 - Static site generator
- **Tailwind CSS** v4.1.18 - Utility-first CSS framework
- **DaisyUI** v5.5.13 - Component library for Tailwind CSS
- **TypeScript** - Built-in support

## Project Structure

```
/
├── public/          # Static assets (favicon, etc.)
├── src/
│   ├── assets/      # Images, fonts, etc.
│   ├── components/  # Reusable Astro components
│   │   ├── Hero.astro
│   │   ├── About.astro
│   │   ├── CV.astro
│   │   ├── Portfolio.astro
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
├── tailwind.config.mjs # Tailwind + DaisyUI configuration
└── package.json
```

## Getting Started

### Development

```bash
npm install
npm run dev
```

Visit `http://localhost:4321` to see your site.

### Build

```bash
npm run build
```

This creates a `dist/` folder with your static site ready to deploy.

### Preview

```bash
npm run preview
```

Preview your production build locally.

## Features

- Zero JavaScript by default (optimal performance)
- DaisyUI components for beautiful, consistent UI
- Responsive design out of the box
- Smooth scrolling navigation
- Form handling with validation
- Fade-in animations on scroll
- Dark/light theme support (DaisyUI)

## Customization

- Edit components in `src/components/` to customize sections
- Modify `tailwind.config.mjs` to customize DaisyUI themes
- Update `src/layouts/Layout.astro` to change the overall layout
- Add your content in the respective component files

## Deployment

The `dist/` folder contains static files that can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

## Learn More

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [DaisyUI Documentation](https://daisyui.com/docs)
