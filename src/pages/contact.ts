import { uiIcon } from "../site/identity";
const select = (
  name: string,
  label: string,
  choices: string[],
  required = false,
) =>
  `<label>${label}${required ? " *" : " <span>(optional)</span>"}<select name="${name}" ${required ? "required" : ""}><option value="">Select an option</option>${choices.map((choice) => `<option>${choice}</option>`).join("")}</select></label>`;
export const contact = `
<section class="wrap contact-heading"><p class="eyebrow">LET’S FIND YOUR NEXT STEP</p><h1>A little about you.<br> <em>A good place to start.</em></h1><p class="lead">Tell Matt what’s on your mind. You don’t need exact numbers<br class="desktop"> or a perfect plan to start a conversation.</p></section>

<section class="wrap intake-layout"><aside><h2>It starts with<br> a conversation.</h2><p>This introduction helps Matt understand your goals before connecting with you.</p><p>Share only what you’re comfortable sharing. Please don’t include account numbers, passwords, Social Security numbers, or financial documents.</p><hr><p>Prefer to reach out directly?</p><a class="icon-link" href="mailto:madamou@afin-consulting.com">${uiIcon("contact")}Email Matt</a><a class="icon-link" href="tel:+12037706522">${uiIcon("phone")}(203) 770-6522</a><p class="micro">* Required fields</p></aside><form id="intake">
<fieldset><legend><span>01</span> Let’s get acquainted</legend><div class="fields"><label>Full name *<input name="name" autocomplete="name" required maxlength="100"></label><label>Email address *<input type="email" name="email" autocomplete="email" required maxlength="200"></label><label>Phone <span id="phone-requirement">(optional)</span><input type="tel" name="phone" autocomplete="tel" maxlength="40"></label>${select("contactPreference", "Preferred way to connect", ["Email", "Phone"], true)}<label>Location / time zone <span>(optional)</span><input name="location" maxlength="100" placeholder="City, state or time zone"></label>${select("clientType", "Who is this for?", ["Myself", "My partner and me", "My small business"], true)}</div><label id="business-field" hidden>Business name and type <span>(optional)</span><input name="business" maxlength="200" disabled></label></fieldset>

<fieldset><legend><span>02</span> What brings you here?</legend><p>Select any areas you’d like to explore.</p><div class="choices">${[
  ["budget", "Building a budget"],
  ["debt", "Paying down debt"],
  ["goals", "Saving toward a goal"],
  ["habits", "Building money habits"],
  ["business", "Small-business finances"],
  ["unsure", "Finding a starting point"],
]
  .map(
    ([value, label]) =>
      `<label><input type="checkbox" name="goals" value="${value}">${label}</label>`,
  )
  .join(
    "",
  )}</div><label>What would you most like to change? *<textarea name="priority" required maxlength="2000" rows="4" placeholder="What’s your biggest challenge, or what would progress look like for you?"></textarea></label></fieldset>

<fieldset><legend><span>03</span> The bigger picture</legend><p>Optional context. Estimates are welcome.</p><div class="fields">${select("budget", "Current budgeting approach", ["I don’t have a budget yet", "Spreadsheet or app", "A plan I’d like to improve", "Prefer to discuss"])}${select("debt", "Debt you’d like help with", ["Credit cards", "Student loans", "Personal or auto loans", "Several types of debt", "No debt focus", "Prefer to discuss"])}${select("timeline", "When would you like to begin?", ["As soon as possible", "Within a month", "In 1–3 months", "Just exploring"])}${select("experience", "Worked with a financial coach before?", ["Yes", "No"])}</div><label>Anything else Matt should know? <span>(optional)</span><textarea name="notes" maxlength="2000" rows="3" placeholder="Upcoming changes, shared goals, or questions about working together."></textarea></label><label>Good times to connect <span>(optional)</span><input name="availability" maxlength="200" placeholder="For example, weekday afternoons Eastern"></label></fieldset>
<div class="honeypot" aria-hidden="true"><label>Leave this blank<input name="_gotcha" tabindex="-1" autocomplete="off"></label></div><label class="consent"><input type="checkbox" name="consent" required><span>I agree that Afin may use these details to respond to my inquiry. <a href="/privacy/">Privacy details</a>.</span></label><p id="delivery-note" class="micro"></p><button class="button" type="submit" id="submit">Prepare my introduction </button><p id="form-status" role="status" tabindex="-1"></p><div id="email-fallback" hidden><label>Your introduction<textarea id="email-copy" readonly rows="8"></textarea></label><a id="email-link" class="text-link">Open email draft</a><p class="micro">Send the draft from your email app to complete your inquiry. You can also copy the text and email madamou@afin-consulting.com.</p></div><noscript><p>The guided form needs JavaScript. Please <a href="mailto:madamou@afin-consulting.com">email Matt</a> or call (203) 770-6522.</p></noscript></form></section>
<section class="wrap section editorial"><div><p class="eyebrow">AFTER YOUR INTRODUCTION</p><h2>A conversation,<br> then a decision.</h2></div><div><h3>Check the delivery message.</h3><p>If the form prepares an email draft, review and send it from your own email app. A draft is not a delivered inquiry.</p><h3>Explore the fit with Matt.</h3><p>Your introduction gives Matt context for discussing your priorities. You can ask about the coaching approach, scope, and fees before deciding on next steps.</p><h3>Keep a way to reconnect.</h3><p>You can also email <a href="mailto:madamou@afin-consulting.com">madamou@afin-consulting.com</a> or call <a href="tel:+12037706522">(203) 770-6522</a>.</p></div></section>
<section class="wrap section faq"><div class="faq-heading"><p class="eyebrow">BEFORE YOU REACH OUT</p><h2>A few helpful details.</h2></div><div class="faq-items"><details name="afin-faq"><summary>What if I’m not sure what kind of help I need?<span class="faq-toggle" aria-hidden="true"></span></summary><p>Select “Finding a starting point” and describe what feels difficult. You don’t need to choose a service before connecting.</p></details><details name="afin-faq"><summary>Do I need exact financial numbers?<span class="faq-toggle" aria-hidden="true"></span></summary><p>No. The optional questions provide context, and estimates are welcome. Keep account numbers, passwords, Social Security numbers, and financial documents out of your introduction.</p></details><details name="afin-faq"><summary>Does this form book a session?<span class="faq-toggle" aria-hidden="true"></span></summary><p>No. It starts an inquiry. Timing, scope, and fees are discussed with Matt before work begins.</p></details></div></section>
`;
