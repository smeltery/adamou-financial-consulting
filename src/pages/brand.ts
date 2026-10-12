import { uiIcon } from "../site/identity";
export const brand = /* HTML */ `
  <section class="wrap contact-heading">
    <p class="eyebrow">THE AFIN BRAND</p>
    <h1>
      Grounded in clarity.
      <br />
      <em>Built for possibility.</em>
    </h1>
    <p class="lead">A visual identity for a more personal path forward.</p>
  </section>

  <section class="wrap section brand-mark">
    <div class="mark-preview">
      <img
        src="/assets/afin-mark.svg"
        width="300"
        height="144"
        alt="Afin mountain symbol"
      />
    </div>
    <div>
      <p class="eyebrow">01 / THE MARK</p>
      <h2>A clear direction.</h2>
      <p>
        The overlapping mountain lines from Matt’s business card, redrawn as a
        clean, scalable SVG. The symbol stands on its own, without a wordmark.
      </p>
      <a class="button" href="/assets/afin-mark.svg" download="afin-mark.svg">
        Download the SVG ${uiIcon("download")}
      </a>
      <p class="micro">
        Keep its proportions. Leave at least one peak’s height of clear space.
        Use on a light, uncluttered background.
      </p>
    </div>
  </section>

  <section class="wrap section favicon-section" aria-labelledby="favicon-title">
    <div>
      <p class="eyebrow">THE SMALL DETAILS</p>
      <h2 id="favicon-title">
        A familiar mark.
        <br />
        Even in a small tab.
      </h2>
      <p>
        A bolder mountain mark on a warm-paper tile stays recognizable in light
        and dark browser tabs.
      </p>
      <a
        class="text-link"
        href="/assets/afin-favicon.svg"
        download="afin-favicon.svg"
      >
        Download the favicon ${uiIcon("download")}
      </a>
    </div>
    <div class="favicon-preview">
      <div class="favicon-tab">
        <img
          src="/assets/afin-favicon.svg"
          width="16"
          height="16"
          alt="Afin favicon in a browser tab"
        />
        <span>Adamou Financial Consulting</span>
      </div>
      <p class="micro">Browser tab preview</p>
      <div class="favicon-sizes">
        ${[16, 32, 48]
          .map(
            (size) => /* HTML */ `
              <figure>
                <div>
                  <img
                    src="/assets/afin-favicon.svg"
                    width="${size}"
                    height="${size}"
                    alt="Afin favicon at ${size} pixels"
                  />
                </div>
                <figcaption>${size} × ${size}</figcaption>
              </figure>
            `,
          )
          .join("")}
      </div>
      <p class="micro">One scalable SVG, shown at common icon sizes.</p>
    </div>
  </section>

  <section class="wrap section">
    <p class="eyebrow">02 / COLOR</p>
    <h2>Calm. Warm. Confident.</h2>
    <div class="swatches">
      ${[
        ["Mountain blue", "#315E89"],
        ["Deep blue", "#204F60"],
        ["Warm paper", "#F7F4EB"],
        ["Sage", "#78978E"],
        ["Sand", "#E7C78C"],
      ]
        .map(
          ([name, hex]) => /* HTML */ `
            <div>
              <div style="background:${hex}"></div>
              <h3>${name}</h3>
              <code>${hex}</code>
            </div>
          `,
        )
        .join("")}
    </div>
  </section>

  <section class="wrap section brand-type">
    <div>
      <p class="eyebrow">03 / TYPOGRAPHY</p>
      <h2>
        Room to breathe.
        <br />
        <em>Words that connect.</em>
      </h2>
      <p>
        Georgia brings warmth to headlines. The system sans-serif keeps everyday
        information clear, fast, and easy to read.
      </p>
    </div>
    <div>
      <p class="eyebrow">TYPE IN PRACTICE</p>
      <h3 style="font-family:Georgia,serif;font-size:36px">
        A clearer way forward.
      </h3>
      <p>Personal guidance. Practical steps. Your goals.</p>
      <p class="micro">
        Use generous spacing, short paragraphs, and descriptive labels.
      </p>
    </div>
  </section>
  <section
    class="wrap section editorial chapter-reverse"
    aria-labelledby="brand-voice-title"
  >
    <div>
      <p class="eyebrow">04 / OUR VOICE</p>
      <h2 id="brand-voice-title">
        Clear.
        <br />
        Personal.
        <br />
        Practical.
      </h2>
    </div>
    <div class="chapter-copy">
      <p class="lead">Speak like a helpful person.</p>
      <p>
        Use familiar language, give people a next step, and put their goals
        first.
      </p>
      <blockquote>
        “A budget that fits your life.
        <br />
        A financial coach in your corner.”
      </blockquote>
      <p>
        Avoid jargon, pressure, and promises of specific financial outcomes.
      </p>
    </div>
  </section>
  <section class="wrap section editorial">
    <div>
      <p class="eyebrow">05 / USING THE IDENTITY</p>
      <h2>
        Let the mark
        <br />
        stand on its own.
      </h2>
    </div>
    <div>
      <h3>Keep the shape intact.</h3>
      <p>
        Scale the mountain symbol proportionally. Don’t stretch it, rotate it,
        add effects, or place text inside its lines.
      </p>
      <h3>Choose a quiet background.</h3>
      <p>
        Use the blue symbol on a light background. A white version can be used
        on deep blue when the mountain lines stay clear.
      </p>
      <h3>Protect readability.</h3>
      <p>
        Deep blue on warm paper is the primary text pairing. Sage and sand
        support the design; they should not replace a readable text color for
        small labels or essential instructions.
      </p>
    </div>
  </section>
  <section class="wrap section editorial">
    <div>
      <p class="eyebrow">06 / IMAGERY</p>
      <h2>
        Real people.
        <br />
        A sense of direction.
      </h2>
    </div>
    <div>
      <p>
        Matt’s portrait introduces the person behind the business. The
        mountain-path photograph gives the homepage a calm, open feeling without
        distracting from the services.
      </p>
      <p>
        Prefer natural images with room for the message. Avoid imagery that
        implies guaranteed wealth or specific financial outcomes.
      </p>
      <a
        href="https://unsplash.com/photos/winding-path-through-a-green-mountain-valley-MIfIDLi_PIE"
      >
        View the photograph by Valentin on Unsplash
      </a>
    </div>
  </section>
`;
export const privacy = /* HTML */ `
  <section class="wrap contact-heading">
    <p class="eyebrow">YOUR INFORMATION</p>
    <h1>
      A thoughtful
      <br />
      first conversation.
    </h1>
    <p class="lead">
      What you share with Afin, how an inquiry travels, and where to ask
      questions.
    </p>
  </section>
  <section class="wrap section editorial">
    <div>
      <p class="eyebrow">01 / YOUR INTRODUCTION</p>
      <h2>What you share.</h2>
    </div>
    <div>
      <p>
        The intake form asks for contact details, financial goals, and optional
        context so Matt can respond to your inquiry.
      </p>
      <p>
        Avoid sending account numbers, Social Security numbers, passwords, or
        financial documents. Optional questions can be left blank.
      </p>
    </div>
  </section>
  <section class="wrap section editorial">
    <div>
      <p class="eyebrow">02 / DELIVERY</p>
      <h2>
        How your inquiry
        <br />
        travels.
      </h2>
    </div>
    <div>
      <p>
        If direct submission is enabled, your form is sent through Formspree to
        Afin. Formspree processes that submission under its
        <a href="https://formspree.io/legal/privacy-policy/">privacy policy</a>
        .
      </p>
      <p>
        Otherwise, the form prepares an email draft that you review and send
        through your own email provider. Your email provider and Formspree, when
        used, may retain sent messages or submissions.
      </p>
    </div>
  </section>
  <section class="wrap section editorial">
    <div>
      <p class="eyebrow">03 / WEBSITE ANALYTICS</p>
      <h2>
        Understanding
        <br />
        page visits.
      </h2>
    </div>
    <div>
      <p>
        The site uses Vercel Web Analytics to understand aggregate page visits
        without advertising cookies. Query strings and fragments are removed
        from analytics events; intake answers are not included in analytics.
      </p>
      <p>
        The hosting provider may process ordinary request information to serve
        the site.
      </p>
    </div>
  </section>
  <section class="wrap section editorial">
    <div>
      <p class="eyebrow">04 / FORM ANSWERS</p>
      <h2>
        While you’re
        <br />
        on the page.
      </h2>
    </div>
    <div>
      <p>
        Intake answers and calculator inputs are not saved in browser storage.
        Calculator values stay in your browser and are not sent to Matt or
        included in analytics. Navigating away or reloading may clear your
        answers.
      </p>
      <p>
        A small “welcomed” flag is saved in this browser so the first-visit
        confetti plays only once. It contains no personal or financial
        information and is not sent to Matt. Clearing site data resets it. The
        animation respects reduced-motion settings.
      </p>
      <p>
        If a direct submission fails, the form keeps your answers on the page so
        you can retry or prepare an email draft. A success message appears only
        after the provider accepts the submission.
      </p>
    </div>
  </section>
  <section class="wrap section editorial">
    <div>
      <p class="eyebrow">05 / CONTACT</p>
      <h2>
        Questions about
        <br />
        your information?
      </h2>
    </div>
    <div>
      <p>
        Contact
        <a href="mailto:madamou@afin-consulting.com">
          madamou@afin-consulting.com
        </a>
        about information you have shared or to request deletion.
      </p>
      <p>
        For an inquiry about coaching, use the
        <a href="/contact/">client introduction form</a>
        or email Matt directly.
      </p>
    </div>
  </section>
`;
