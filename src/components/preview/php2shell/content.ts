import type { Faq } from "../services/content";

/**
 * Copy for the PHP2Shell checker. Every fact here comes from the PHP project's
 * 21 October 2026 security release, or from Amazon, Cloudflare and Calif as
 * reported on 21 October. Check those before changing a date or a version.
 */

export const PHP2SHELL_PATH = "/php2shell-checker";

export const PHP2SHELL_META = {
  title: "PHP2Shell Checker: Is Your Website Vulnerable? | Webgro",
  description:
    "Free PHP2Shell checker. Enter your website to see if it's exposed to CVE-2026-109618 and CVE-2026-109619, the critical PHP flaws patched on 21 October 2026.",
};

export const PHP2SHELL_PUBLISHED = "2026-10-22";

export const fixedReleases = [
  { branch: "PHP 8.5", fixed: "8.5.12", note: "Update available" },
  { branch: "PHP 8.4", fixed: "8.4.27", note: "Update available" },
  { branch: "PHP 8.3", fixed: "8.3.36", note: "Update available" },
  { branch: "PHP 8.2", fixed: "8.2.35", note: "Update available. Support ends on 31 December 2026." },
  { branch: "PHP 8.1 and older", fixed: "No release", note: "Move to PHP 8.4 or 8.5, or get your host to confirm they've patched it." },
];

export const timeline = [
  {
    date: "17 October",
    body: "Amazon's threat intelligence team records the first attempt to exploit the flaws, four days before they were made public.",
  },
  {
    date: "20 October",
    body: "The two CVE numbers leak on Hacker News. The PHP project brings its security release forward by a day.",
  },
  {
    date: "21 October",
    body: "PHP releases 8.5.12, 8.4.27, 8.3.36 and 8.2.35. Cloudflare adds firewall rules for the known attacks, and Amazon reports the flaws are being widely exploited.",
  },
];

export const findVersion = [
  {
    name: "WordPress",
    body: "Log in to your dashboard and go to Tools, then Site Health. Open the Info tab, expand Server, and look for PHP version.",
  },
  {
    name: "cPanel hosting",
    body: "Log in to cPanel and open MultiPHP Manager (on some hosts it's called Select PHP Version) in the Software section.",
  },
  {
    name: "Plesk hosting",
    body: "Open Websites & Domains, choose your domain and open PHP Settings. The version is at the top.",
  },
  {
    name: "Anything else",
    body: "Ask your hosting company which PHP version your site runs on, and whether they've applied the PHP2Shell fix.",
  },
];

export const php2shellFaqs: Faq[] = [
  {
    q: "What is PHP2Shell?",
    a: "PHP2Shell is the name given to two vulnerabilities in PHP itself, CVE-2026-109618 and CVE-2026-109619. Either one lets an attacker run their own code on a web server without logging in, which means they can change your site, add malware or take customer data. The PHP project rates both 9.2 out of 10 for severity and released the fix on 21 October 2026.",
  },
  {
    q: "Is my WordPress site affected?",
    a: "If your WordPress site's server runs a PHP version older than 8.5.12, 8.4.27, 8.3.36 or 8.2.35, it is. The flaw is in PHP, not in WordPress, so updating WordPress, your theme or your plugins won't fix it. The PHP on your server has to be updated, which on most hosting is done by your hosting company or in your hosting control panel.",
  },
  {
    q: "Are Shopify, Wix and Squarespace sites affected?",
    a: "No. On those platforms you don't run your own PHP server. The platform looks after its own servers, so there's nothing for you to do.",
  },
  {
    q: "How does the checker work?",
    a: "It loads your home page once, the same way a browser does, and reads what your server says about itself. That tells us which platform the site is on and, if the server shows it, which PHP version it runs. It never sends attack code to your site. The domain and the result go in our server logs, and we don't use them to contact you.",
  },
  {
    q: "Why does the checker say my PHP version is hidden?",
    a: "Most hosting companies hide the PHP version from visitors, which is good practice. It means the checker can tell your site runs on PHP but can't see whether it has the fix. Follow the steps on this page to find your version, or ask us and we'll find out for you.",
  },
  {
    q: "My version looks old, but my host says it's patched. Who's right?",
    a: "Possibly both. Ubuntu, Debian, Red Hat and some hosting companies patch their own builds of PHP without changing the main version number. If your host confirms in writing that the PHP2Shell fix is applied, you can trust that over the version number.",
  },
  {
    q: "Does Cloudflare protect my site?",
    a: "Partly. Cloudflare has added firewall rules for the known attacks, on every plan including the free one, but it describes them as a stopgap. New versions of the attack can get past firewall rules, so you still need to update PHP.",
  },
  {
    q: "What if my site is on PHP 8.1 or older?",
    a: "The PHP project no longer releases updates for 8.1 and older, so there's no official fix. The safe option is to move the site to PHP 8.4 or 8.5. Older themes and plugins sometimes break on newer PHP, so it's worth having someone test the site first. We can do that for you.",
  },
];
