import { closing, testimonial } from "./sections";
import { linkedin, linkedIcon } from "./identity";
const intro = (eyebrow: string, title: string, description: string) =>
  `<section class="wrap contact-heading"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="lead">${description}</p></section>`;
const variants: Record<string, string> = {
  "02 / DEBT PAYOFF PLANNING": "panel",
  "03 / FINANCIAL GOALS": "reverse",
  "WHO IT’S FOR": "cards",
  "WHAT AFIN STANDS FOR": "statement",
  "THE WORKING RELATIONSHIP": "cards",
  "GET TO KNOW THE FIT": "panel",
  "01 / YOUR INTRODUCTION": "panel",
  "02 / THE FIRST CONVERSATION": "checklist",
  "03 / AGREEING ON A DIRECTION": "statement",
  "PREPARING WITHOUT OVERTHINKING": "cards",
};
const chapter = (label: string, title: string, content: string) =>
  `<section class="wrap section editorial chapter-${variants[label] || "split"}"><div><p class="eyebrow">${label}</p><h2>${title}</h2></div><div class="chapter-copy">${content}</div></section>`;
const faq = (items: string[][]) =>
  `<section class="wrap section faq"><p class="eyebrow">A FEW THINGS YOU MAY BE WONDERING</p><h2>Good questions.<br>Clear answers.</h2>${items.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</section>`;
export const servicesPage =
  intro(
    "FINANCIAL COACHING",
    "Make your money<br><em>work for your life.</em>",
    "Explore where personalized coaching can help: your everyday budget, your debt, and the goals you want to move toward.",
  ) +
  chapter(
    "01 / PERSONALIZED BUDGETING",
    "A budget you can<br>come back to.",
    `<p class="lead">A useful budget starts with the life you actually live.</p><p>Bring your income, regular commitments, and changing expenses into one clearer picture. The goal is a practical plan you can use when everyday decisions come up.</p><h3>This may be your starting point if…</h3><ul><li>You’re not sure where your money goes each month.</li><li>You have a budget, but it rarely matches real life.</li><li>You want to make room for saving without guessing what’s available.</li></ul><a class="text-link" href="/contact/?goal=budget">Talk about your budget</a>`,
  ) +
  chapter(
    "02 / DEBT PAYOFF PLANNING",
    "Turn a list of balances<br>into a direction.",
    `<p class="lead">Debt feels different when you can see a next step.</p><p>Explore a payoff plan in the context of your other responsibilities and goals. Personalized guidance can help you think through priorities and what is realistic for your situation.</p><h3>Start with the questions that matter.</h3><ul><li>Which balances are taking up the most attention?</li><li>What can your budget support consistently?</li><li>How does paying down debt fit with your other priorities?</li></ul><p>You don’t need to send statements or account numbers to introduce yourself.</p><a class="text-link" href="/contact/?goal=debt">Discuss a debt payoff plan</a>`,
  ) +
  chapter(
    "03 / FINANCIAL GOALS",
    "Give your goals<br>a place in the plan.",
    `<p class="lead">Big ambitions become more useful when they connect to everyday choices.</p><p>Whether you’re preparing for a change, building savings, or looking for more financial stability, coaching starts by understanding what progress means to you.</p><h3>A useful goal has context.</h3><p>Consider what you’re working toward, why it matters, and when you would like to get there. Those details help shape a conversation about practical next steps.</p><a class="text-link" href="/contact/?goal=goals">Share what you’re working toward</a>`,
  ) +
  chapter(
    "WHO IT’S FOR",
    "Different lives.<br>Personal guidance.",
    `<div class="reading-cards"><article><h3>Individuals</h3><p>Find a starting point for your own budget, debt, or goals—even if you’ve never worked with a coach.</p></article><article><h3>Couples</h3><p>Bring shared priorities and different perspectives into a conversation about what you want your money to support.</p></article><article><h3>Small-business owners</h3><p>Describe the budgeting and financial planning challenges of running your business. Discuss the right scope of coaching directly with Matt.</p></article></div>`,
  ) +
  faq([
    [
      "Do I need to choose one service?",
      "No. You can select several interests in the intake form, or choose “Finding a starting point.” Your priorities can overlap.",
    ],
    [
      "What does coaching cost?",
      "Discuss fees and the scope of work directly with Matt before getting started. The site does not list a fixed package or price.",
    ],
    [
      "What if my situation doesn’t fit these examples?",
      "Use the introduction form to describe what you need. The first conversation is a chance to explore whether Afin is a fit.",
    ],
  ]) +
  closing;
export const aboutPage =
  intro(
    "ABOUT AFIN",
    "A person in your corner.<br><em>Meet Matt Adamou.</em>",
    "Financial coaching built around your goals, your circumstances, and a clearer way forward.",
  ) +
  `<section class="about about-page"><div class="wrap about-grid"><div class="portrait"><img src="/assets/matt-adamou.jpg" width="751" height="751" alt="Matt Adamou smiling"><span>MATT ADAMOU / FINANCIAL COACH</span></div><div><p class="eyebrow">THE PERSON BEHIND AFIN</p><h2>Personal guidance<br>starts with a person.</h2><p class="lead">Matt is the financial coach behind Adamou Financial Consulting.</p><p>He helps individuals, couples, and small businesses with customized financial strategies, personalized budgets, and debt payoff planning. Afin’s focus is a long-term partnership around your goals and financial growth.</p><a class="text-link" href="${linkedin}">${linkedIcon} View Matt’s LinkedIn profile</a></div></div></section>` +
  chapter(
    "WHAT AFIN STANDS FOR",
    "Your life sets<br>the direction.",
    `<p class="lead">Financial guidance should connect to something that matters to you.</p><p>A calmer month. Less uncertainty around debt. More room for a goal you’ve put off. Your reason for seeking help is the starting point—not a template you need to fit.</p><p>Afin brings the conversation back to your priorities so the next steps have a purpose you recognize.</p>`,
  ) +
  chapter(
    "THE WORKING RELATIONSHIP",
    "Practical.<br>Personal.<br>Built together.",
    `<div class="reading-cards"><article><h3>Clarity before complexity</h3><p>Start with what is happening today and what you want to understand better. A useful next step should make sense in your everyday life.</p></article><article><h3>Room for your circumstances</h3><p>Your responsibilities, timing, and goals shape the conversation. You don’t need to arrive with everything organized.</p></article><article><h3>A longer view</h3><p>Afin’s focus on partnership connects today’s financial choices with the direction you want to grow.</p></article></div>`,
  ) +
  testimonial +
  chapter(
    "GET TO KNOW THE FIT",
    "You can start<br>with a question.",
    `<p>Choosing a coach is personal, too. Ask Matt how his approach relates to your situation, what working together could involve, and how scope and fees would be agreed.</p><p>Explore <a href="/approach/">the coaching approach</a> for a closer look at the first conversation, or <a href="/services/">browse the services</a> to see where you might start.</p><a class="button" href="/contact/">Introduce yourself to Matt</a>`,
  );
export const approachPage =
  intro(
    "OUR APPROACH",
    "Start with where you are.<br><em>Build from there.</em>",
    "A clear introduction, a conversation about fit, and an agreed direction before the work begins.",
  ) +
  chapter(
    "01 / YOUR INTRODUCTION",
    "Tell Matt what<br>you want to change.",
    `<p class="lead">A first message doesn’t need to tell your whole financial story.</p><p>Share who the coaching is for, the challenge or goal on your mind, and how you prefer to connect. Add context if it helps; estimates and incomplete plans are welcome.</p><ul><li>Choose budgeting, debt, goals, or several areas.</li><li>Describe what would make a difference to you.</li><li>Include your timing and availability if you know them.</li></ul><a class="text-link" href="/contact/">Open the introduction form</a>`,
  ) +
  chapter(
    "02 / THE FIRST CONVERSATION",
    "Understand the situation.<br>Explore the fit.",
    `<p>Use the conversation to put your priorities in context and ask questions about coaching. Matt can discuss how Afin’s services relate to what you need.</p><h3>Questions worth bringing</h3><ul><li>Where would it make sense to start?</li><li>What would working together involve?</li><li>How would the scope and fees be agreed?</li><li>What information would be useful for the next step?</li></ul><p>An inquiry opens this conversation; it does not book an appointment or begin a paid engagement.</p>`,
  ) +
  chapter(
    "03 / AGREEING ON A DIRECTION",
    "Know the next step<br>before taking it.",
    `<p class="lead">The plan should reflect the priorities you’ve discussed.</p><p>Before work begins, agree with Matt on the scope, fees, and next steps. Budgeting, debt payoff planning, and goal-focused guidance may play different roles depending on your circumstances.</p><p>This is also the time to clarify what you need to prepare and how you will stay in contact.</p>`,
  ) +
  chapter(
    "PREPARING WITHOUT OVERTHINKING",
    "Three things<br>to reflect on.",
    `<div class="reading-cards"><article><h3>What feels difficult?</h3><p>Name one part of managing money that takes more energy than you would like.</p></article><article><h3>What matters most?</h3><p>Think about the change you want your financial decisions to support.</p></article><article><h3>What would progress feel like?</h3><p>A more useful budget or a clearer debt plan is a concrete place to begin.</p></article></div>`,
  ) +
  faq([
    [
      "Should I upload financial documents?",
      "No. The introductory form has no document upload. Leave out account numbers, passwords, Social Security numbers, and financial documents.",
    ],
    [
      "What happens when I use the form?",
      "The page tells you whether it will send directly or prepare an email draft. If it prepares a draft, you still need to send it from your email app. Only a confirmed direct submission means the inquiry has been delivered.",
    ],
    [
      "Can I contact Matt without the form?",
      "Yes. Email madamou@afin-consulting.com or call (203) 770-6522. Share a brief introduction and your preferred way to connect.",
    ],
  ]) +
  closing;
