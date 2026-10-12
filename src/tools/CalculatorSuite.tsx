import { useEffect, useState } from "react";
import { calculators } from "./catalog";
import { moneyFormat, regions } from "./currencies";
import { result } from "./results";

type Calculator = (typeof calculators)[number];

function CalculatorForm({
  tool,
  locale,
  ready,
}: {
  tool: Calculator;
  locale: string;
  ready: boolean;
}) {
  const defaults = () =>
    Object.fromEntries(
      tool.fields.map(([name, , example]) => [name, String(example)]),
    );
  const [values, setValues] = useState(defaults);
  const [valid, setValid] = useState(true);
  const numbers = Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, Number(value)]),
  );
  const [amount, label, detail] = result(tool.id, numbers, moneyFormat(locale));
  const target =
    tool.id === "emergency"
      ? numbers.expenses * numbers.months
      : tool.id === "savings"
        ? numbers.target
        : 0;
  const percent = Math.min(100, (numbers.saved / target) * 100);
  const currency = moneyFormat(locale).resolvedOptions().currency;

  return (
    <form
      data-calculator={tool.id}
      autoComplete="off"
      onSubmit={(event) => {
        event.preventDefault();
        setValid(event.currentTarget.checkValidity());
      }}
      onReset={(event) => {
        event.preventDefault();
        setValues(defaults());
        setValid(true);
      }}
    >
      <div className="tool-fields">
        {tool.fields.map(([name, fieldLabel, , unit]) => (
          <label key={name}>
            {fieldLabel}{" "}
            <span data-currency-unit={unit ? undefined : ""}>
              ({unit || currency})
            </span>
            <input
              type="number"
              inputMode="decimal"
              name={name}
              value={values[name]}
              min="0"
              max={unit === "months" ? 120 : unit ? 100 : 1000000000}
              step={unit === "months" || unit === "years" ? 1 : 0.01}
              required
              disabled={!ready}
              onChange={(event) => {
                setValues({ ...values, [name]: event.target.value });
                setValid(event.target.form!.checkValidity());
              }}
            />
          </label>
        ))}
        <button className="button" type="submit" disabled={!ready}>
          Calculate
        </button>
        <button className="reset-tool" type="reset" disabled={!ready}>
          Reset example
        </button>
      </div>
      <div
        className="tool-result"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {!ready ? (
          <p>
            Example values are shown. Change them to explore your situation.
          </p>
        ) : !valid ? (
          "Enter a valid amount in every field. Use nonnegative numbers within the displayed limits."
        ) : (
          <>
            <p>{label}</p>
            <strong>{amount}</strong>
            <p>{detail}</p>
            {target > 0 && (
              <>
                <p>{percent.toFixed(0)}% of target already saved</p>
                <meter
                  min="0"
                  max="100"
                  value={percent}
                  aria-label="Share of target already saved"
                />
              </>
            )}
          </>
        )}
      </div>
    </form>
  );
}

export default function CalculatorSuite({ toolId }: { toolId?: string }) {
  const available = toolId
    ? calculators.filter((tool) => tool.id === toolId)
    : calculators;
  const [locale, setLocale] = useState("en-US");
  const [selected, setSelected] = useState(toolId || "budget");

  const [ready, setReady] = useState(false);

  // The server renders a single example; hydrate before accepting input.
  useEffect(() => {
    const select = () => {
      const requested = location.hash.replace("#tool-", "");
      setSelected(
        !toolId && calculators.some((tool) => tool.id === requested)
          ? requested
          : toolId || "budget",
      );
    };
    select();
    setReady(true);
    window.addEventListener("hashchange", select);
    return () => window.removeEventListener("hashchange", select);
  }, [toolId]);

  const title =
    calculators.find((tool) => tool.id === selected)?.title || "Monthly budget";

  return (
    <section className="wrap tool-workspace" aria-label="Financial calculators">
      <div className="tool-controls">
        <div className="tool-picker">
          <span className="tool-picker-label">Your calculator</span>
          <button
            type="button"
            data-search="tools"
            disabled={!ready}
            aria-haspopup="dialog"
            aria-controls="site-search"
          >
            <svg
              className="ui-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <rect x="5" y="3" width="14" height="18" rx="2" />
              <path d="M8 7h8M8 11h2m4 0h2m-8 4h2m4 0h2" />
            </svg>
            <span>
              <strong id="selected-tool">{title}</strong>
              <small>Browse all {calculators.length} tools</small>
            </span>
            <svg
              className="ui-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <path d="m8 9 4-4 4 4m-8 6 4 4 4-4" />
            </svg>
          </button>
        </div>
        <label className="currency-picker">
          Country and currency
          <select
            id="tool-currency"
            disabled={!ready}
            value={locale}
            onChange={(event) => setLocale(event.target.value)}
          >
            {regions.map(([country, countryLocale, currency]) => (
              <option key={country} value={countryLocale}>
                {country} · {currency}
              </option>
            ))}
          </select>
          <span>
            Changes units and formatting, not exchange rates. Enter every amount
            in the selected currency.
          </span>
        </label>
      </div>
      <noscript>
        <p>
          Enable JavaScript for interactive results. Each tool’s formula and
          assumptions are available below.
        </p>
      </noscript>
      {available.map((tool) => (
        <article
          key={tool.id}
          className="calculator"
          id={`tool-${tool.id}`}
          hidden={selected !== tool.id}
        >
          <div className="tool-intro">
            <p className="eyebrow">EXPLORE YOUR NUMBERS</p>
            <h2>{tool.title}</h2>
            <p>{tool.question}</p>
            {!toolId && (
              <a className="text-link" href={`/tools/${tool.slug}/`}>
                Open this calculator’s guide
              </a>
            )}
          </div>
          <CalculatorForm tool={tool} locale={locale} ready={ready} />
          <details className="tool-method" open>
            <summary>How this estimate works</summary>
            <p>{tool.formula}</p>
            <p>{tool.note}</p>
          </details>
        </article>
      ))}
    </section>
  );
}
