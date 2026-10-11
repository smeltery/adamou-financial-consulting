import { services, about, approach, closing, testimonial } from "./sections";
const intro = (eyebrow: string, title: string, description: string) =>
  `<section class="wrap contact-heading"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="lead">${description}</p></section>`;
export const servicesPage =
  intro(
    "FINANCIAL COACHING",
    "Practical help.<br><em>Personal to you.</em>",
    "Budgeting, debt payoff planning, and financial goals for individuals, couples, and small businesses.",
  ) +
  services +
  `<section class="wrap section prose"><h2>Start where you are.</h2><p>Whether you’re managing money on your own, making decisions as a couple, or balancing the needs of a small business, the starting point is your situation and priorities.</p><h2>A plan you can work with.</h2><p>Share what feels difficult and what you want to change. Matt will discuss how personalized budgeting, debt payoff planning, or goal-focused support could help you move forward.</p><p>Scope, fees, and next steps are discussed directly with Matt before work begins.</p></section>` +
  closing;
export const aboutPage =
  intro(
    "ABOUT AFIN",
    "Meet your coach.<br><em>Matt Adamou.</em>",
    "The person behind Adamou Financial Consulting.",
  ) +
  about.replace('class="about"', 'class="about about-page"') +
  testimonial +
  `<section class="wrap section prose"><h2>Your goals lead the conversation.</h2><p>Afin’s approach centers on customized financial strategies aligned with your goals. From a practical budget to a debt payoff plan, the work starts with understanding what matters to you.</p><p>The aim is a long-term partnership focused on your financial growth, with support for individuals, couples, and small businesses.</p><a class="button" href="/contact/">Connect with Matt</a></section>`;
export const approachPage =
  intro(
    "OUR APPROACH",
    "One conversation.<br><em>A clearer next step.</em>",
    "A straightforward way to explore financial coaching, without needing to have everything figured out.",
  ) +
  approach +
  `<section class="wrap section prose"><h2>What to bring to the first conversation</h2><p>A goal, a question, or a challenge is enough. Think about what you want your money to make possible and what feels difficult today.</p><h2>What happens after your inquiry?</h2><p>Matt uses your introduction to understand your priorities and connect through your preferred contact method. You’ll discuss whether coaching is a fit, along with scope, fees, and next steps.</p><h2>Keep the introduction simple.</h2><p>Approximate context is welcome. Don’t include account numbers, passwords, Social Security numbers, or financial documents in the intake form.</p></section>` +
  closing;
