const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const html = readFileSync(join(__dirname, "..", "audex", "index.html"), "utf8");
const section = (id) => {
  const match = html.match(new RegExp(`<section\\b[^>]*\\bid="${id}"[^>]*>([\\s\\S]*?)</section>`));
  assert.ok(match, `Missing section ${id}`);
  return match[1];
};
const text = (value) => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");

test("internal navigation targets exist and identifiers are unique", () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(target), `Missing #${target}`);
});

test("new customers have assisted access steps without an implied activation or checkout", () => {
  const gettingStarted = text(section("get-started"));
  for (const phrase of [
    "Public self-service registration and checkout are not yet available",
    "does not create an account, start a trial or take a payment",
    "Confirm availability and suitability", "Receive account-setup instructions",
    "do not need to configure a server", "Set up your first audit",
  ]) assert.ok(gettingStarted.includes(phrase), phrase);
  const pricing = text(section("pricing"));
  assert.ok(pricing.includes("planned individual prices, not an active online purchase offer"));
  assert.ok(pricing.includes("Shared workspaces and team subscriptions are not included"));
});

test("role authority is separate from individual subscription capacity", () => {
  const access = text(section("access"));
  for (const phrase of [
    "Paying for Professional does not grant Admin or Owner access",
    "Auditor", "Admin", "Owner",
    "Admins cannot appoint other Admins or manage Admin or Owner accounts",
    "single platform Owner", "not public signup",
    "do not grant access to other users' audit records or billing",
    "do not expose passwords", "No shared team workspace is included",
  ]) assert.ok(access.includes(phrase), phrase);
});

test("app links are sign-in actions and access requests stay external enquiries", () => {
  const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
  const appLinks = links.filter(([, href]) => href === "https://audex.mrhdigital.co.za/");
  assert.ok(appLinks.length >= 4);
  for (const [, , label] of appLinks) assert.match(text(label), /Sign in/);
  const requestLinks = links.filter(([, , label]) => /Request access by email|Request access on WhatsApp|Request AudEx access/.test(text(label)));
  assert.equal(requestLinks.length, 3);
  for (const [, href] of requestLinks) assert.match(href, /^(mailto:|https:\/\/wa\.me\/)/);
  assert.doesNotMatch(html, /href="[^"]*(?:\/register|\/checkout)/);
});

test("preview and checklist claims remain clearly bounded", () => {
  assert.match(html, /not independently certified compliance standards/);
  assert.match(html, /Existing audits retain the checklist they started with/);
  assert.match(html, /not a live audit or compliance assessment/);
  assert.doesNotMatch(html, /"(?:offers|aggregateRating)"\s*:/);
});
