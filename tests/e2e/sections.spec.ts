import { expect, test } from '@playwright/test'
import { hydrated } from './helpers'

const SECTION_IDS = [
  'now',
  'work',
  'projects',
  'life',
  'stack',
  'proof',
  'writing',
  'github',
  'contact',
]

test.describe('homepage structure', () => {
  test('has every section id, each a labelled landmark', async ({ page }) => {
    await page.goto('/')
    for (const id of SECTION_IDS) {
      const section = page.locator(`#${id}`)
      await expect(section, `#${id}`).toBeAttached()
      const name = await section.getAttribute('aria-labelledby')
      const label = await section.getAttribute('aria-label')
      expect(name ?? label, `#${id} needs a name`).toBeTruthy()
    }
    // One main landmark, and the page is not broken into unnamed regions.
    await expect(page.getByRole('main')).toHaveCount(1)
    await expect(page.getByRole('region')).toHaveCount(SECTION_IDS.length + 2) // + the hero and the heatmap scroller
  })

  test('headings never skip a level, and there is exactly one h1', async ({ page }) => {
    await page.goto('/')
    const levels = await page
      .locator('h1, h2, h3, h4, h5, h6')
      .evaluateAll((headings) => headings.map((heading) => Number(heading.tagName[1])))
    expect(levels[0]).toBe(1)
    expect(levels.filter((level) => level === 1)).toHaveLength(1)
    levels.forEach((level, index) => {
      if (index > 0) expect(level - levels[index - 1]!, `heading ${index}`).toBeLessThanOrEqual(1)
    })
  })

  test('shows draft and sample chips throughout, as the placeholder policy asks', async ({
    page,
  }) => {
    await page.goto('/')
    for (const id of SECTION_IDS.filter((id) => id !== 'writing' && id !== 'now')) {
      const chips = page.locator(`#${id}`).getByText(/^(draft|sample|link|copy)$/i)
      await expect(chips.first(), `#${id}`).toBeVisible()
    }
  })

  test('the header anchors scroll to their sections', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name: /life$/ })
      .click()
    await expect(page).toHaveURL(/#life$/)
    await expect
      .poll(async () => (await page.locator('#life').boundingBox())!.y, { timeout: 4000 })
      .toBeLessThan(200)
  })
})

test.describe('stack', () => {
  test('six groups in a bordered grid: three columns on desktop, two, then one', async ({
    page,
  }) => {
    const columns = async (width: number) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      return page
        .locator('#stack h3')
        .first()
        .locator('xpath=../..')
        .evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(' ').length)
    }
    await page.goto('/')
    await expect(page.locator('#stack h3')).toHaveCount(6)
    expect(await columns(1440)).toBe(3)
    expect(await columns(700)).toBe(2)
    expect(await columns(390)).toBe(1)
    await expect(page.getByRole('link', { name: /Everything I use/ })).toHaveAttribute(
      'href',
      '/uses'
    )
  })

  test('a rose slash appears before the items of the hovered group', async ({ page }) => {
    await page.goto('/')
    const group = page.locator('#stack h3').first().locator('xpath=..')
    const item = group.locator('li').first()
    const opacity = () => item.evaluate((el) => getComputedStyle(el, '::before').opacity)
    await group.scrollIntoViewIfNeeded()
    expect(await opacity()).toBe('0')
    await group.hover()
    await expect.poll(opacity).toBe('1')
  })
})

test.describe('proof', () => {
  test('the carousel works by keyboard and cross-fades between quotes', async ({ page }) => {
    await page.goto('/')
    await hydrated(page)
    const tabs = page.getByRole('tab')
    await expect(tabs).toHaveCount(3)
    const panels = page.getByRole('tabpanel', { includeHidden: true })
    const opacities = () =>
      panels.evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).opacity))
    expect(await opacities()).toEqual(['1', '0', '0'])

    // Scroll there first and let the page settle: a key pressed right after a focus-induced jump
    // of thousands of pixels can be lost by the browser, which is not what is being tested.
    await tabs.first().scrollIntoViewIfNeeded()
    await page.waitForTimeout(600)
    await tabs.first().focus()
    await page.keyboard.press('ArrowRight')
    await expect(tabs.nth(1)).toBeFocused()
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
    await expect.poll(opacities).toEqual(['0', '1', '0'])
    await page.keyboard.press('End')
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true')
    await page.keyboard.press('ArrowRight')
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true') // wraps
  })

  test('swiping on a touch device changes the quote', async ({ browser }) => {
    const context = await browser.newContext({
      hasTouch: true,
      isMobile: true,
      viewport: { width: 390, height: 844 },
    })
    const page = await context.newPage()
    await page.goto('/')
    await hydrated(page)
    const quote = page.getByRole('tabpanel').first()
    await quote.scrollIntoViewIfNeeded()
    const box = (await quote.boundingBox())!
    const y = box.y + box.height / 2
    // Playwright has no touch-swipe API: synthesize the pointer events a swipe produces.
    await quote.evaluate(
      (el, { x, y }) => {
        const target = el.parentElement!
        const fire = (type: string, clientX: number) =>
          target.dispatchEvent(
            new PointerEvent(type, { bubbles: true, clientX, clientY: y, pointerType: 'touch' })
          )
        fire('pointerdown', x + 150)
        fire('pointerup', x)
      },
      { x: box.x + 40, y }
    )
    await expect(page.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true')
    await context.close()
  })

  test('lists the certifications', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#proof').getByText(/Issuer · 20\d\d/)).toHaveCount(3)
  })
})

test.describe('writing', () => {
  test('lists the three latest posts, newest first, linking to /blog/[slug]', async ({ page }) => {
    await page.goto('/')
    const rows = page.locator('#writing ul > li a')
    await expect(rows).toHaveCount(3)
    const hrefs = await rows.evaluateAll((links) => links.map((link) => link.getAttribute('href')))
    expect(hrefs).toEqual([
      '/blog/240112-a-commitment-to-change',
      '/blog/240108-posthog-over-google-analytics',
      '/blog/231221-hello-world',
    ])
    await expect(rows.first()).toContainText('12 Jan 2024')
    await expect(rows.first()).toContainText(/\d+ min/)
    await expect(page.getByRole('link', { name: /All posts/ })).toHaveAttribute('href', '/blog')
  })

  test('the title slides right on hover', async ({ page }) => {
    await page.goto('/')
    const row = page.locator('#writing ul > li a').first()
    await row.scrollIntoViewIfNeeded()
    await row.hover()
    await expect
      .poll(() => row.locator('h3').evaluate((el) => getComputedStyle(el).translate))
      .toBe('8px')
  })
})

test.describe('github', () => {
  test('a 53×7 heatmap in five steps, with a total, a legend and a tooltip per cell', async ({
    page,
  }) => {
    await page.goto('/')
    await hydrated(page)
    const heatmap = page.getByTestId('contribution-heatmap')
    await heatmap.scrollIntoViewIfNeeded()
    // 53 columns of 14px, less the last gap, and 7 rows.
    const box = (await heatmap.boundingBox())!
    expect(Math.round(box.width)).toBe(53 * 14 - 3)
    expect(Math.round(box.height)).toBe(7 * 14 - 3)
    // Five steps: one path per level, all of them drawn.
    await expect(heatmap.locator('path')).toHaveCount(5)
    const fills = await heatmap
      .locator('path')
      .evaluateAll((paths) => paths.map((path) => getComputedStyle(path).fill))
    expect(new Set(fills).size).toBe(5)
    await expect(page.getByTestId('contribution-total')).not.toHaveText('0')
    await expect(page.getByText('Less', { exact: false }).first()).toBeVisible()

    // The middle of the cell in column 30, row 3. Hover until the tooltip shows (the pointer may
    // arrive while the page is still busy).
    await expect(async () => {
      await page.mouse.move(box.x + 30 * 14 + 5, box.y + 3 * 14 + 5)
      await expect(page.getByRole('tooltip')).toContainText(
        /contributions? on [A-Z][a-z]{2} \d+, \d{4}/,
        { timeout: 500 }
      )
    }).toPass()
    // 30 weeks and 3 days after the first Sunday (12 Oct 2025) is Wednesday 13 May 2026.
    await expect(page.getByRole('tooltip')).toContainText('May 13, 2026')
    // The gap between two cells has no tooltip, and neither does the page outside the graph.
    await page.mouse.move(box.x + 30 * 14 + 12, box.y + 3 * 14 + 5)
    await expect(page.getByRole('tooltip')).toHaveCount(0)
    await page.mouse.move(5, 5)
    await expect(page.getByRole('tooltip')).toHaveCount(0)
  })

  test('on a phone the heatmap scrolls inside its own box, not the page', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 })
    await page.goto('/')
    const scroller = page.getByRole('region', { name: /Contribution heatmap/ })
    await scroller.scrollIntoViewIfNeeded()
    const metrics = await scroller.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
    }))
    expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth)
    const pageOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
    expect(pageOverflow).toBeLessThanOrEqual(0)
    // It can be scrolled with the keyboard.
    await scroller.focus()
    await page.keyboard.down('ArrowRight')
    await page.waitForTimeout(400)
    await page.keyboard.up('ArrowRight')
    await expect.poll(() => scroller.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0)
  })
})

test.describe('contact', () => {
  test('shows the heading, the booking card and the form', async ({ page }) => {
    await page.goto('/')
    const section = page.locator('#contact')
    await expect(section.getByRole('heading', { level: 2 })).toHaveText(/Got something\s*in mind\?/)
    await expect(section.getByText('Google Calendar · appointment schedule')).toBeVisible()
    for (const detail of ['30 min', 'Video call', 'Asia/Manila (GMT+8)']) {
      await expect(section.getByText(detail, { exact: true })).toBeVisible()
    }
    const book = section.getByRole('link', { name: /Book a 30-min call/ })
    await expect(book).toHaveAttribute('target', '_blank')
    await expect(book).toHaveAttribute('rel', /noopener/)
    await expect(section.getByRole('button', { name: /Send message/ })).toBeVisible()
  })

  test('validates inline, by keyboard, and says nothing was sent for a valid form', async ({
    page,
  }) => {
    await page.goto('/')
    const form = page.getByRole('form', { name: 'Contact form' })
    await form.scrollIntoViewIfNeeded()
    await hydrated(page)
    const send = form.getByRole('button', { name: /Send message/ })

    // Empty: every required field is flagged, and focus goes to the first. A click that lands
    // while React is still hydrating is dropped, so the click is retried.
    await expect(async () => {
      await send.click()
      await expect(form.getByLabel('Name')).toBeFocused({ timeout: 1000 })
    }).toPass()
    await expect(form.getByLabel('Name')).toHaveAccessibleDescription('Add your name.')
    await expect(form.getByLabel('Email')).toHaveAttribute('aria-invalid', 'true')
    await expect(form.getByLabel('Message')).toHaveAttribute('aria-invalid', 'true')
    await expect(form.getByRole('status')).toContainText('Fix the highlighted fields')

    // Fill it in, with a bad email, and submit with the keyboard.
    await form.getByLabel('Name').fill('Ada Lovelace')
    await form.getByLabel('Email').fill('not-an-email')
    await form.getByLabel('Topic').selectOption('A project')
    await form.getByLabel('Message').fill('Hello, I would like to talk about a project.')
    await expect(form.getByLabel('Name')).not.toHaveAttribute('aria-invalid', 'true')
    await send.focus()
    await page.keyboard.press('Enter')
    await expect(form.getByLabel('Email')).toHaveAccessibleDescription(/should look like/)
    await expect(form.getByLabel('Email')).toBeFocused()
    await expect(form.getByLabel('Name')).not.toHaveAttribute('aria-invalid', 'true')

    // Fixed: the form is valid, and says plainly that nothing was sent.
    await form.getByLabel('Email').fill('ada@example.com')
    await send.click()
    await expect(form.getByRole('status')).toContainText('Nothing was sent')
    await expect(form.getByLabel('Email')).not.toHaveAttribute('aria-invalid', 'true')
  })
})

test.describe('keyboard', () => {
  test('every stop on the way down the page has a visible focus ring', async ({ page }) => {
    await page.goto('/')
    await hydrated(page)
    const seen: string[] = []
    for (let step = 0; step < 150; step++) {
      await page.keyboard.press('Tab')
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null
        if (!el || el === document.body) return null
        // Tabbing past the last stop wraps round to the first.
        if (el.dataset.tabstop) return { wrapped: true as const }
        el.dataset.tabstop = 'seen'
        const style = getComputedStyle(el)
        const box = el.getBoundingClientRect()
        return {
          wrapped: false as const,
          label: `${el.tagName.toLowerCase()} ${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 30)}`,
          outline: `${style.outlineStyle} ${style.outlineWidth}`,
          visible: box.width > 0 && box.height > 0,
        }
      })
      if (!info || info.wrapped) break
      seen.push(info.label)
      expect(info.visible, info.label).toBe(true)
      expect(info.outline, info.label).toBe('solid 2px')
    }
    // The skip link, header, every section's links and the form are all reached.
    expect(seen.length).toBeGreaterThan(30)
    expect(seen.some((label) => label.includes('Send message'))).toBe(true)
  })
})

test.describe('JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false })

  test('every section and all of its text is in the page', async ({ page }) => {
    await page.goto('/')
    for (const id of SECTION_IDS) await expect(page.locator(`#${id}`), `#${id}`).toBeAttached()
    // All three recommendations are shown, as a list, with no carousel.
    await expect(page.getByRole('tab')).toHaveCount(0)
    for (const quote of [
      /A real recommendation goes here/,
      /A second recommendation goes here/,
      /A third recommendation goes here/,
    ]) {
      await expect(page.getByText(quote)).toBeVisible()
    }
    await expect(page.locator('#writing ul > li a')).toHaveCount(3)
    await expect(page.getByTestId('contribution-heatmap').locator('path')).toHaveCount(5)
    await expect(page.getByLabel('Name')).toBeVisible()
    // The timeline is fully drawn.
    await expect(page.locator('[data-testid="timeline"] li[data-lit="false"]')).toHaveCount(0)
  })
})

test.describe('narrow screens', () => {
  for (const width of [360, 390]) {
    test(`no horizontal page scroll at ${width}px, top to bottom`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      await page.goto('/')
      const overflow = await page.evaluate(() => ({
        page: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        body: document.body.scrollWidth - document.body.clientWidth,
      }))
      expect(overflow.page).toBeLessThanOrEqual(0)
      expect(overflow.body).toBeLessThanOrEqual(0)
      // Nothing sticks out of the viewport, other than inside a box that scrolls.
      const wide = await page.evaluate((limit) => {
        const out: string[] = []
        document.querySelectorAll('main *').forEach((el) => {
          if (el.closest('[class*="overflow-x-auto"], [class*="overflow-hidden"], svg')) return
          const box = el.getBoundingClientRect()
          if (box.width > 0 && box.right > limit + 1) {
            out.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)}`)
          }
        })
        return out
      }, width)
      expect(wide).toEqual([])
    })
  }
})
