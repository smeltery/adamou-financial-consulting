import { useState } from "react";
import { LockKeyhole, ArrowRight, Mail } from "lucide-react";
import { database, ownerEmail } from "./store";
export function Login({
  onAccess,
  onDemo,
}: {
  onAccess: () => void;
  onDemo?: () => void;
}) {
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!database) return;
    setBusy(true);
    setError("");
    try {
      const result = sent
        ? await database.auth.verifyOtp({
            email: ownerEmail,
            token: code,
            type: "email",
          })
        : await database.auth.signInWithOtp({
            email: ownerEmail,
            options: { shouldCreateUser: false },
          });
      if (result.error) throw result.error;
      if (sent) onAccess();
      else setSent(true);
    } catch {
      setError("Unable to sign in. Check the code or request a new one.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="login">
      <div className="login-art">
        <Brand />
        <p className="eyebrow">THE AFIN WORKSPACE</p>
        <h1>
          More clarity.
          <br />
          <em>For your business.</em>
        </h1>
        <p>
          One place for the people you help, the progress you make, and what
          comes next.
        </p>
        <span>
          <LockKeyhole size={18} /> Private by design. Built for Matt.
        </span>
      </div>
      <div className="login-form">
        <div className="icon-tile">
          <LockKeyhole />
        </div>
        <h2>Welcome back, Matt.</h2>
        <p>Sign in with a one-time code sent to your Afin email.</p>
        {database ? (
          <form onSubmit={submit}>
            <label>
              Email address
              <input value={ownerEmail} disabled type="email" />
            </label>
            {sent && (
              <label>
                Sign-in code
                <input
                  autoFocus
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  minLength={6}
                />
              </label>
            )}
            <button className="primary" disabled={busy}>
              {busy
                ? "Please wait…"
                : sent
                  ? "Open workspace"
                  : "Send sign-in code"}
              <ArrowRight size={18} />
            </button>
            {sent && (
              <button
                type="button"
                className="quiet"
                onClick={() => {
                  setSent(false);
                  setCode("");
                }}
              >
                Request another code
              </button>
            )}
          </form>
        ) : (
          <div className="notice">
            <Mail />
            <div>
              <strong>Ready to connect</strong>
              <p>
                Secure sign-in will be available once Supabase is connected.
                Client records are not accessible.
              </p>
            </div>
          </div>
        )}
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        {onDemo && (
          <button className="secondary" onClick={onDemo}>
            Explore with sample data
          </button>
        )}
        <small>Only Matt’s authorized account can access client records.</small>
      </div>
    </main>
  );
}
export function Brand() {
  return (
    <div className="brand">
      <svg viewBox="0 0 202 86" width="44" aria-hidden="true">
        <path
          d="M7 76 83 7 159 76M54 76 87 46 119 76M100 58 133 21 193 76"
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>
      <span>
        afin<span className="brand-sub">CLIENT WORKSPACE</span>
      </span>
    </div>
  );
}
