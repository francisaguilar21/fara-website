/**
 * Self-contained maintenance page. It's returned straight from middleware, so it must not depend
 * on the app's layout, CSS or fonts. Everything is inline and works under the site's CSP
 * (inline styles allowed, no external fonts or scripts).
 */

const links = [
  { label: 'GitHub', href: 'https://github.com/francisaguilar21' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/francisaguilar21' },
  { label: 'X', href: 'https://twitter.com/faraguilar21' },
]

export function renderMaintenancePage(): string {
  const linkItems = links
    .map((l) => `<li><a href="${l.href}" rel="noopener">${l.label}</a></li>`)
    .join('')

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Francis Aguilar · Back soon</title>
<meta name="description" content="francisaguilar.co is being migrated to something better. Back soon.">
<meta name="color-scheme" content="dark light">
<link rel="icon" href="/static/favicons/favicon.ico">
<style>
  :root {
    --bg: #0B0A0B; --fg: #F5F2F3; --muted: #9C9496; --line: #2A2527; --accent: #F43F5E;
    --display: "Space Grotesk", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    --mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    color-scheme: dark;
  }
  @media (prefers-color-scheme: light) {
    :root { --bg: #FAF9F9; --fg: #141112; --muted: #6B6365; --line: #E7E2E3; --accent: #E11D48; color-scheme: light; }
  }
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    margin: 0; background: var(--bg); color: var(--fg); font-family: var(--display);
    display: grid; place-items: center; padding: 24px clamp(16px, 5vw, 48px);
    -webkit-font-smoothing: antialiased;
  }
  main { width: 100%; max-width: 760px; display: grid; gap: 28px; }
  .logo { font-weight: 700; font-size: 1.5rem; letter-spacing: -0.02em; }
  .logo span { color: var(--accent); }
  .label { font: 500 0.75rem/1.4 var(--mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
  h1 {
    margin: 0; font-weight: 600; font-size: clamp(2.25rem, 7vw, 4.5rem); line-height: 0.98;
    letter-spacing: -0.04em; text-wrap: balance;
  }
  h1 em { font-style: normal; background: linear-gradient(var(--accent), var(--accent)) 0 92% / 100% 0.09em no-repeat; }
  p { margin: 0; max-width: 46ch; font-size: 1.125rem; line-height: 1.6; color: var(--muted); }
  ul { list-style: none; margin: 0; padding: 20px 0 0; border-top: 1px solid var(--line); display: flex; flex-wrap: wrap; gap: 12px 28px; }
  a { color: var(--fg); text-decoration: none; font: 500 0.875rem/1 var(--mono); }
  a::before { content: "/"; color: var(--accent); margin-right: 4px; }
  a:hover, a:focus-visible { color: var(--accent); }
  a:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }
  .slash {
    position: fixed; top: -10vh; bottom: -10vh; right: 12vw; width: 10px; background: var(--accent);
    transform: skewX(-17deg); opacity: 0.9; pointer-events: none;
  }
  @media (max-width: 1180px) { .slash { display: none; } }
</style>
</head>
<body>
  <div class="slash" aria-hidden="true"></div>
  <main>
    <div class="logo" aria-label="Francis Aguilar">F<span>/</span>A</div>
    <span class="label">/maintenance · back soon</span>
    <h1>I'm migrating the site to <em>something better.</em></h1>
    <p>New design, new stack, same posts. Thanks for stopping by. Until it's back, you can find me here:</p>
    <ul>${linkItems}</ul>
  </main>
</body>
</html>`
}
