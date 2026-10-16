# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A mix, with no single priority (confirmed):

- Hiring managers and recruiters weighing Sneha for a full-time PM role.
- Listeners, readers and potential guests for her podcast and Substack.

They usually arrive from a link (LinkedIn, résumé, a podcast or Substack post) and skim for a few minutes to decide whether to reach out.

## Product Purpose

The personal site of Sneha Basu: engineer turned PM, Kellogg MBAi '27 (joint MBA + MS in AI, Northwestern, graduating March 2027). It tells the engineer → PM → AI story and shows what she is building, writing and recording now.

Success is getting in touch, for any reason: roles, collaborations, podcast guests, or just saying hi.

## Positioning

"Technical enough to build it, business enough to bet on it." Five years as a Salesforce software engineer (shipped a RAG-based AI search end to end), then PM at Google on the AI Foundations team improving AI-generated code, a VC internship at Alumni Ventures, and an AI master's alongside the MBA. Few PM candidates can claim to have built the AI systems they would now manage.

Target roles (confirmed): full-time PM roles in AI/ML products, with a lean toward startups.

## Operating Context

- Static single-page site deployed on Netlify from `main`; every push to `main` goes live.
- Podcast episodes load at runtime from the Spotify for Creators RSS feed through `functions/rss-feed.js`, which is cached for 30 minutes. The old Alitu feed is no longer updated.
- Writing lives on Substack (Code&Case); the site links out to it.
- The résumé is served from `Sneha-resume.pdf` and is replaced when a new version is ready.

## Capabilities and Constraints

- Sections: hero and bio, Now Building notes, an origins side-scroller game, a work timeline, writing, podcast player, contact.
- The email address is stored base64-encoded and decoded at runtime, so the plain address never appears in the HTML.
- The origins game is hidden on phones (640px and under) by request.
- **Never name the MBAi capstone partner.** Refer to it only as "a large healthcare company".
- **One earlier internship must never be mentioned anywhere.** Sneha knows which one; its name is deliberately kept out of this public file. Don't add experience that isn't already on the site or the résumé without asking.
- Finished roles are written in the past tense, not as "incoming" or "this quarter".

## Brand Commitments

- **Voice:** candid, warm, a little playful ("DO NOT BE SHY", "say hi."). First person, lowercase-casual in places.
- **Binding visual direction set by Sneha:** Japandi minimalism, matcha, and a bright pink iPod mini, the device that got her into tech. Recorded here as a commitment only; the visual system itself is not documented in this file.
- Name as displayed: Sneha Basu.

## Evidence on Hand

- `Sneha-resume.pdf`: current second-year résumé.
- `sneha-basu-photo.jpg`: headshot. `podcast-cover.jpg`: podcast cover art.
- Podcast: *AI, According to Us*, the Kellogg AI Club podcast, on Spotify. Season 2 is out as of October 2026.
- Substack essays on Code&Case, such as "The new gender gap: AI literacy."
- Résumé facts the site doesn't show yet: the Google evaluation framework for AI-generated code quality, and the Forte Fellow award.
- Absent and must not be invented: testimonials, employer endorsements, and any metrics beyond those on the résumé.

## Product Principles

1. Make reaching out effortless: every section should leave an easy path to email or LinkedIn.
2. Show, don't claim: real projects, real episodes and real writing over adjectives.
3. Keep it current: stale tense or "now" items that are over undercut credibility fast.
4. Personality is the differentiator: the voice and the small playful pieces stay, but never at the expense of clarity.
