import { ToolCTA } from "@/components/blog/ToolCTA";

export default function Content() {
  return (
    <div>
      <p>
        Every time you log into an account protected by two-factor authentication, you type in a
        six-digit code that changes every 30 seconds. That code comes from a{" "}
        <a href="/tools/totp-generator">TOTP generator</a> — usually an app on your phone. But phone
        apps are not the only option. You can also{" "}
        <a href="/tools/totp-generator">generate 2FA codes online</a>, entirely inside your browser,
        with the secret key never leaving your device.
      </p>
      <ToolCTA slug="totp-generator" variant="inline" />
      <p>
        The <a href="/tools/totp-generator">BrowseryTools TOTP Generator</a> computes standard
        RFC&nbsp;6238 time-based one-time passwords locally, using your browser&apos;s built-in
        WebCrypto engine. You can track multiple accounts at once, add them by secret key, by an{" "}
        <code dir="ltr">otpauth://</code> link, or by uploading a screenshot of a QR code. No install,
        no account, no server round-trip.
      </p>

      <h2>What TOTP Actually Is</h2>
      <p>
        TOTP stands for Time-based One-Time Password. When you enable 2FA on a service, that service
        gives you a secret key — usually encoded as a QR code — and both sides remember it: the
        service stores it on its server, and you store it in an authenticator app. From that point on,
        the algorithm is simple: take the shared secret, combine it with the current time rounded down
        to a 30-second window, and run it through a cryptographic hash function. The result is a
        6-digit code. Because both sides know the secret and both sides know the time, they always
        compute the same code — without ever needing to communicate over the network. That is why 2FA
        codes work even with your phone in airplane mode.
      </p>

      <h2>Why a Browser-Based Generator</h2>
      <p>
        A phone authenticator app is a fine default, but it is not always what you have on hand. Maybe
        you are at a desktop workstation and do not want to reach for your phone every time you log
        into an admin panel. Maybe you are testing 2FA integration for an app you are building and want
        to generate codes without provisioning a physical device. Maybe you simply do not want to
        install another app just to see a rotating number. A browser-based generator solves all of
        these: open the tab, see the code, close the tab.
      </p>
      <p>
        The privacy story matters just as much as the convenience. The secret key that produces your
        2FA codes is effectively a password — anyone who has it can generate your codes and get into
        your account. Because this tool runs the RFC&nbsp;6238 algorithm with WebCrypto directly in
        your browser, the secret is never transmitted anywhere. There is no server it gets uploaded to,
        no analytics call carrying it off, no third party in the loop. Everything happens on the page
        you are looking at, and it keeps working even if you disconnect from the internet after the
        first load.
      </p>

      <h2>Adding an Account: Three Ways</h2>
      <p>
        Most services show you a QR code when you set up 2FA, but that QR code always encodes a plain
        secret underneath, and most services also offer that secret as text if you cannot scan a code.
        The generator supports all three paths:
      </p>
      <p>
        <strong>By secret key.</strong> If the service shows you a &quot;can&apos;t scan the code?&quot;
        text option, copy that string of letters and numbers. Paste it into the Manual tab along with a
        label (and optionally an issuer name), and the tool starts computing codes immediately. An
        Advanced section lets you match non-default settings — 6 or 8 digits, a 30 or 60 second period,
        and SHA-1, SHA-256, or SHA-512 as the hash algorithm — for the rare service that does not use
        the standard defaults.
      </p>
      <p>
        <strong>By otpauth:// link.</strong> Some services give you a direct{" "}
        <code dir="ltr">otpauth://totp/...</code> link instead of, or in addition to, a QR code. Paste
        the whole link into the URI tab and the tool parses out the label, issuer, secret, and any
        non-default settings automatically.
      </p>
      <p>
        <strong>By QR code screenshot.</strong> If all you have is the QR code on screen, take a
        screenshot of it and upload the image in the QR tab. The tool decodes the QR image locally
        using the same in-browser processing as everything else — the image is never uploaded — reads
        out the embedded <code dir="ltr">otpauth://</code> link, and adds the account exactly as if you
        had pasted the link yourself.
      </p>
      <p>
        Whichever path you use, if you add an account with a secret and label that already exist, the
        tool asks whether you want to replace the existing entry or keep both — so you will not end up
        with silent duplicates.
      </p>

      <h2>&quot;Save on This Device&quot; — Read This Before You Turn It On</h2>
      <p>
        By default, accounts you add exist only for the current browser session — refresh the page and
        they are gone. Each account has a &quot;Save on this device&quot; toggle that, when switched on,
        writes that account&apos;s secret to your browser&apos;s local storage so it survives a reload.
        It is off by default, and that default is deliberate.
      </p>
      <p>
        Here is the honest trade-off. Saved secrets are stored <strong>unencrypted</strong> in your
        browser profile. Anyone with access to that browser profile — another user of the same computer
        login, malware with local file access, or someone who gets hold of your machine — can read
        them. A dedicated authenticator app is meaningfully stronger here: it typically encrypts its
        storage and benefits from OS-level protections (biometric locks, a sandboxed app data
        directory) that a browser&apos;s local storage does not have. This tool is built for
        convenience and transparency, not as a hardened secrets vault, and it is not trying to be one.
      </p>
      <p>
        A practical rule: leave the toggle off on any shared or public machine — a work computer other
        people can log into, a library terminal, anything you do not fully control. It is fine to turn
        on for accounts on your own personal, encrypted, password-locked device where you accept the
        trade-off for convenience.
      </p>

      <h2>What It Does Not Do</h2>
      <p>
        Two limits are worth knowing up front. The generator supports TOTP only — it does not support
        HOTP (counter-based one-time passwords), which is a different, less common standard used by a
        handful of hardware tokens.
      </p>
      <p>
        It also does not support Google Authenticator&apos;s bulk &quot;export accounts&quot; QR code,
        which bundles multiple accounts into one proprietary migration format. If you scan one of those,
        the tool tells you so and points you to the fix: go back into Google Authenticator and export
        your accounts one at a time instead, which produces a standard, single-account QR code this
        tool (and any other standards-compliant authenticator) can read.
      </p>

      <h2>Try It Now</h2>
      <p>
        Open the <a href="/tools/totp-generator">TOTP Generator</a>, add your first account by secret,
        link, or QR screenshot, and watch the code roll over every 30 seconds. It works offline once the
        page has loaded, and nothing you type into it ever leaves your device. While you are there,
        check out the rest of BrowseryTools&apos; security utilities, including a{" "}
        <a href="/tools/password-strength">password strength checker</a> and a{" "}
        <a href="/tools/text-encryption">text encryption tool</a>.
      </p>
      <ToolCTA slug="totp-generator" variant="card" />
    </div>
  );
}
