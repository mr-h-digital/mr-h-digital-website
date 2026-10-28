const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { runInNewContext } = require("node:vm");
const script = readFileSync(join(__dirname, "..", "audex", "script.js"), "utf8");
const contactScript = script.slice(script.indexOf('const enquiryForm ='));

function harness(fetch) {
  const button = { disabled: true };
  const status = { dataset: {}, focus() { this.focused = true; } };
  const data = new Map(Object.entries({
    name: " Visitor ", email: "visitor@example.test", type: "ACCESS",
    message: "Please explain access.", consent: "on", sites: "2",
  }));
  const form = {
    action: "https://audex-api.mrhdigital.co.za/api/contact",
    querySelector: () => button, reportValidity: () => true,
    addEventListener(_, listener) { this.submit = listener; },
    reset() { this.cleared = true; },
  };
  runInNewContext(contactScript, {
    document: { getElementById: id => id === "audex-contact-form" ? form : status },
    window: {}, FormData: class { get(key) { return data.get(key); } },
    fetch, AbortController, setTimeout, clearTimeout, Error, TypeError, SyntaxError,
  });
  return { form, button, status, submit: () => form.submit({ preventDefault() {} }) };
}

test("accepted SMTP response clears the form and sends only the expected JSON without credentials", async () => {
  let request;
  const h = harness(async (url, options) => {
    request = { url, ...options };
    return { ok: true, json: async () => ({ status: "accepted", message: "Accepted by email service." }) };
  });
  assert.equal(h.button.disabled, false);
  await h.submit();
  assert.equal(h.form.cleared, true);
  assert.equal(h.status.dataset.error, "false");
  assert.equal(h.status.focused, true);
  assert.equal(request.credentials, "omit");
  assert.deepEqual(JSON.parse(request.body), {
    name: "Visitor", email: "visitor@example.test", type: "ACCESS",
    organisation: "", facilityType: "", phone: "", message: "Please explain access.",
    website: "", sites: 2, consent: true,
  });
});

for (const scenario of ["unavailable", "limited", "network", "timeout", "unexpected", "malformed"]) {
  test(`${scenario} keeps entries, gives a truthful error and enables retry`, async () => {
    const h = harness(async () => {
      if (scenario === "network") throw new TypeError("fetch failed");
      if (scenario === "timeout") { const error = new Error("timeout"); error.name = "AbortError"; throw error; }
      return {
        ok: !["unavailable", "limited"].includes(scenario), status: scenario === "limited" ? 429 : 503,
        json: async () => {
          if (scenario === "malformed") throw new SyntaxError("invalid");
          return { message: "Not an acceptance" };
        },
      };
    });
    await h.submit();
    assert.equal(h.form.cleared, undefined);
    assert.equal(h.button.disabled, false);
    assert.equal(h.status.dataset.error, "true");
    assert.match(h.status.textContent, /entries have been kept/);
    assert.match(h.status.textContent, /duplicate/);
    if (scenario === "limited") assert.match(h.status.textContent, /limit/);
  });
}

test("double submission sends once and invalid fields never send", async () => {
  let resolve, calls = 0;
  const h = harness(() => { calls++; return new Promise(done => { resolve = done; }); });
  const first = h.submit();
  assert.equal(h.button.disabled, true);
  await h.submit();
  assert.equal(calls, 1);
  resolve({ ok: true, json: async () => ({ status: "accepted", message: "Accepted." }) });
  await first;
  h.form.reportValidity = () => false;
  await h.submit();
  assert.equal(calls, 1);
});
