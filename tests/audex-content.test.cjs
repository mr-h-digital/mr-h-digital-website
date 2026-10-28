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

test("desktop, mobile and footer navigation link directly to the contact section", () => {
  for (const label of ["Main navigation", "Mobile navigation", "Footer navigation"]) {
    const nav = html.match(new RegExp(`<nav\\b[^>]*aria-label="${label}"[^>]*>([\\s\\S]*?)</nav>`));
    assert.ok(nav, `Missing ${label}`);
    assert.match(nav[1], /<a href="#contact">Contact<\/a>/);
  }
});

test("desktop header and mobile menu expose the same destinations and section labels", () => {
  const links = value => [...value.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
    .map(([, href, label]) => ({ href, label: text(label).trim() }));
  const desktop = html.match(/<nav class="desktop-nav"[^>]*>([\s\S]*?)<\/nav>/)[1];
  const actions = html.match(/<div class="nav-actions">([\s\S]*?)<\/div>/)[1];
  const mobile = html.match(/<nav class="mobile-nav"[^>]*>([\s\S]*?)<\/nav>/)[1];
  assert.deepEqual(links(desktop + actions).map(link => link.href).sort(), links(mobile).map(link => link.href).sort());
  assert.deepEqual(links(desktop), links(mobile).slice(0, 6));
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

test("independent positioning retains methodology provenance without promising team features", () => {
  const content = text(html);
  for (const phrase of [
    "Independent software for healthcare and senior living",
    "facility operators, housekeeping managers, independent auditors and cleaning contractors",
    "You do not need to work for WPC",
    "WPC labels in the app identify the existing checklist or scoring methodology",
    "not the product's ownership or a universal industry standard",
    "cross-account reporting are not included",
  ]) assert.ok(content.includes(phrase), phrase);
  assert.match(html, /<title>AudEx \| Housekeeping audits for healthcare and senior living<\/title>/);
});

test("enquiries have accessible required fields, direct fallback and one WhatsApp destination", () => {
  const contact = section("contact");
  assert.match(contact, /action="https:\/\/audex-api\.mrhdigital\.co\.za\/api\/contact"/);
  for (const name of ["name", "email", "type", "message", "consent"]) {
    assert.match(contact, new RegExp(`<(?:input|select|textarea)\\b[^>]*name="${name}"[^>]*required`));
  }
  assert.match(contact, /<button[^>]*type="submit"[^>]*disabled/);
  assert.match(contact, /<noscript>/);
  assert.match(contact, /not subscribe you to marketing/);
  assert.match(contact, /not account activation or payment/);
  assert.match(contact, /role="status" aria-live="polite"/);
  const whatsapp = [...html.matchAll(/href="https:\/\/wa\.me\/([^?"]+)/g)];
  assert.equal(whatsapp.length, 2);
  for (const [, number] of whatsapp) assert.equal(number, "27845414102");
});

test("facility types allow multiple selections without relying on the message", () => {
  const contact = section("contact");
  assert.match(contact, /<legend>Facility types \(optional\)<\/legend>/);
  assert.match(contact, /Select all that apply/);
  for (const type of ["HOSPITAL", "CLINIC", "RETIREMENT_VILLAGE", "OTHER"]) {
    assert.match(contact, new RegExp(`<input name="facilityTypes"[^>]*type="checkbox"[^>]*value="${type}"`));
  }
  assert.doesNotMatch(contact, /name="facilityType"|value="MIXED"/);
  assert.match(contact, /id="facility-other-details" hidden/);
  assert.match(contact, /name="otherFacilityType" maxlength="160" disabled/);
  assert.match(contact, /Total number of sites \(optional\)/);
  assert.match(contact, /Across all selected facility types/);
});
