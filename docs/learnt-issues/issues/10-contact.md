Part of {{EPIC}} · Blocked by {{LAYOUT}}

## Bug

`src/pages/contact.astro` posts to `action="/api/contact"`, but there is no `src/pages/api/` and the site builds as static output. **Every submission fails.**

## Scope

- **Switch to Netlify Forms:**
  - `name="contact"`, `data-netlify="true"`;
  - a hidden `form-name` input;
  - a honeypot field (`netlify-honeypot="bot-field"`);
  - `action="/contact/thanks"`.
- **Add a `/contact/thanks` page** in the same style, with a link back to the archive.
- **Fields:**
  - Name and Email (side by side on desktop);
  - "What's it about?" select: A project in the archive, Collaboration, Speaking or workshop, Just saying hello;
  - "Which project? (optional)";
  - Message.
- **Optional prefill:** a "Spot something wrong? Tell me" link on detail pages points to `/contact?project={slug}` and fills the project field.
- **Left column:**
  - H1 "Built something similar? Spotted a better fix?";
  - copy: "Open to questions and collaboration." This replaces "Currently available for new opportunities";
  - the link list (Portfolio, GitHub, LinkedIn, X) from `site.ts`.
- **Reply-window line:** decide the copy or remove it.

## Acceptance criteria

- [ ] A test submission on a deploy preview appears in Netlify → Forms.
- [ ] Every input has a visible `<label>`, the correct `type` and `autocomplete`, and inputs are at least 48px tall.

## Testing

- **Build-time:** check that the built `dist/contact/index.html` contains a `<form>` with `data-netlify="true"`, a hidden `form-name`, and the honeypot. Netlify only detects forms present in the static HTML.
- **End-to-end:**
  - an empty submit shows native validation on Name, Email and Message;
  - an invalid email is rejected;
  - `/contact?project=side-project-status` prefills the project field;
  - a valid submit on a deploy preview redirects to `/contact/thanks`.
- **Manual:** one real submission on the deploy preview, confirmed in Netlify → Forms, and the email notification arrives.
- **Spam:** a submission with the honeypot filled is not delivered.
- **Accessibility:** axe in both themes; error messages are linked with `aria-describedby`; the thanks page moves focus to its heading.

## Suggestions

- Turn on Netlify's reCAPTCHA only if spam actually shows up; the honeypot is usually enough.
- Set up a Netlify form notification that tags the email subject with the topic, e.g. "[Learnt · Project] …".
- Keep `mailto:` as a plain-text fallback under the form for people who block scripts or forms.
