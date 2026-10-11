import { services, about, approach, closing, testimonial } from "./sections";
export const home = `

<section class="hero wrap"><div class="hero-copy"><p class="eyebrow">ADAMOU FINANCIAL CONSULTING</p><h1>Less money stress.<br>More <em>possibility.</em></h1><p class="lead">A budget that fits your life. A plan to pay down debt.<br class="desktop"> A financial coach in your corner.</p><a class="button" href="/contact/">Find your next step</a><p class="micro">Personal guidance. Practical steps. Your goals.</p></div><figure class="hero-photo"><img src="/assets/mountain-path.jpg" alt="A winding trail leading through a green Alpine valley toward mountain peaks" width="1400" height="933" fetchpriority="high"><figcaption><span>YOUR PATH. YOUR PACE.</span><strong>A clearer way forward.</strong></figcaption></figure></section>

<div class="audience"><div class="wrap"><span>GOOD WITH PEOPLE. PRACTICAL WITH MONEY.</span><p>For individuals <i>✳</i> For couples <i>✳</i> For small businesses</p></div></div>

${services}


${about}


${approach}


<section class="tool-spotlight"><div class="wrap"><div><p class="eyebrow">A LITTLE CLARITY, RIGHT NOW</p><h2>Put your numbers<br>into perspective.</h2><p>Start with a question. Try a few numbers. Our free tools help you explore a budget, a savings goal, or a path out of debt—at your own pace.</p><a class="button" href="/tools/">Explore the financial tools</a><p class="micro">No account. No saved financial data. Your choice of currency.</p></div><div class="tool-preview"><p class="eyebrow">FIVE WAYS TO FIND A STARTING POINT</p><ul><li><span>01</span><div><strong>Monthly budget</strong><p>See what’s left after your commitments.</p></div></li><li><span>02</span><div><strong>Emergency fund</strong><p>Explore a buffer for the unexpected.</p></div></li><li><span>03</span><div><strong>Savings goal</strong><p>Connect a monthly contribution to your goal.</p></div></li><li><span>04</span><div><strong>Debt payoff</strong><p>See how payments shape a payoff estimate.</p></div></li><li><span>05</span><div><strong>Net worth</strong><p>Bring assets and debts into one snapshot.</p></div></li></ul></div></div></section>

${testimonial}

${closing}
`;
