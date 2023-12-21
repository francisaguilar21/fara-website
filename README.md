
# FARA Website

This is my website that was heavily inspired by [Timothy's Tailwind NextJS Starter Blog](https://github.com/timlrx/tailwind-nextjs-starter-blog). Everything is buit with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/) with [React Server Component](https://nextjs.org/docs/getting-started/react-essentials#server-components) and uses [Contentlayer](https://www.contentlayer.dev/) to manage markdown content.

## Quick Start Guide

1. Clone the repo
2. Personalize `siteMetadata.js` (site related information)
3. Modify the content security policy in `next.config.js` if you want to use
   other analytics provider or a commenting solution other than giscus.
4. Personalize `authors/default.md` (main author)
5. Modify `projectsData.ts`
6. Modify `headerNavLinks.ts` to customize navigation links
7. Add blog posts
8. Deploy on Vercel

## Installation

```bash
yarn
```

## Development

First, make sure you're using `NVM` and use `Node 20.10.0`.

After, you can then run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Edit the layout in `app` or content in `data`. With live reloading, the pages auto-updates as you edit them.

## Extend / Customize

`data/siteMetadata.js` - contains most of the site related information which should be modified for a user's need.

`data/authors/default.md` - default author information (required). Additional authors can be added as files in `data/authors`.

`data/projectsData.js` - data used to generate styled card on the projects page.

`data/headerNavLinks.js` - navigation links.

`data/logo.svg` - replace with your own logo.

`data/blog` - replace with your own blog posts.

`public/static` - store assets such as images and favicons.

`tailwind.config.js` and `css/tailwind.css` - tailwind configuration and stylesheet which can be modified to change the overall look and feel of the site.

`css/prism.css` - controls the styles associated with the code blocks. Feel free to customize it and use your preferred prismjs theme e.g. [prism themes](https://github.com/PrismJS/prism-themes).

`contentlayer.config.ts` - configuration for Contentlayer, including definition of content sources and MDX plugins used. See [Contentlayer documentation](https://www.contentlayer.dev/docs/getting-started) for more information.

`components/MDXComponents.js` - pass your own JSX code or React component by specifying it over here. You can then use them directly in the `.mdx` or `.md` file. By default, a custom link, `next/image` component, table of contents component and Newsletter form are passed down. Note that the components should be default exported to avoid [existing issues with Next.js](https://github.com/vercel/next.js/issues/51593).

`layouts` - main templates used in pages:

- There are currently 3 post layouts available: `PostLayout`, `PostSimple` and `PostBanner`. `PostLayout` is the default 2 column layout with meta and author information. `PostSimple` is a simplified version of `PostLayout`, while `PostBanner` features a banner image.
- There are 2 blog listing layouts: `ListLayout`, the layout used in version 1 of the template with a search bar and `ListLayoutWithTags`, currently used in version 2, which omits the search bar but includes a sidebar with information on the tags.

`app` - pages to route to. Read the [Next.js documentation](https://nextjs.org/docs/app) for more information.

`next.config.js` - configuration related to Next.js. You need to adapt the Content Security Policy if you want to load scripts, images etc. from other domains.

## Post

Content is modelled using [Contentlayer](https://www.contentlayer.dev/), which allows you to define your own content schema and use it to generate typed content objects. See [Contentlayer documentation](https://www.contentlayer.dev/docs/getting-started) for more information.

### Frontmatter

Frontmatter follows [Hugo's standards](https://gohugo.io/content-management/front-matter/).

Please refer to `contentlayer.config.ts` for an up to date list of supported fields. The following fields are supported:

```
title (required)
date (required)
tags (optional)
lastmod (optional)
draft (optional)
summary (optional)
images (optional)
authors (optional list which should correspond to the file names in `data/authors`. Uses `default` if none is specified)
layout (optional list which should correspond to the file names in `data/layouts`)
canonicalUrl (optional, canonical url for the post for SEO)
```

Here's an example of a post's frontmatter:

```
---
title: 'Introducing Tailwind Nexjs Starter Blog'
date: '2021-01-12'
lastmod: '2021-01-18'
tags: ['next-js', 'tailwind', 'guide']
draft: false
summary: 'Looking for a performant, out of the box template, with all the best in web technology to support your blogging needs? Checkout the Tailwind Nextjs Starter Blog template.'
images: ['/static/images/canada/mountains.jpg', '/static/images/canada/toronto.jpg']
authors: ['default', 'sparrowhawk']
layout: PostLayout
canonicalUrl: https://tailwind-nextjs-starter-blog.vercel.app/blog/introducing-tailwind-nextjs-starter-blog
---
```

## Deploy

**Vercel**  
The easiest way to deploy the template is to deploy on [Vercel](https://vercel.com). Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Frequently Asked Questions

- [How can I add a custom MDX component?](/faq/custom-mdx-component.md)
- [How can I customize the `kbar` search?](/faq/customize-kbar-search.md)
- [How do I deploy on Github pages?](/faq/github-pages-deployment.md)

## Licence

[MIT](https://github.com/timlrx/tailwind-nextjs-starter-blog/blob/main/LICENSE) © [Timothy Lin](https://www.timlrx.com)
