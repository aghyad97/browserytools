export default function Content() {
  return (
    <div>
      <p>
        When you type a message into a notes app or a web form, where does it go? In most cases, the text
        travels to a server, gets stored in a database, and potentially gets read by anyone with database
        access — the company's employees, a data breach attacker, or a government subpoena. Client-side
        encryption is the technical approach that changes this equation: your data is encrypted before it
        ever leaves your device, so even the server that stores it cannot read it.
      </p>
      <p>
        You can encrypt and decrypt any text directly in your browser using the{" "}
        <a href="/tools/text-encryption">BrowseryTools Text Encryption tool</a> — free, no sign-up,
        your data never leaves your device.
      </p>

      <h2>What Client-Side Encryption Actually Means</h2>
      <p>
        Client-side encryption means that the cryptographic operations (encrypting and decrypting data)
        happen on the user's device — in the browser, in a mobile app, or in a desktop application —
        before any data is transmitted or stored. The server receives only ciphertext: an unreadable,
        scrambled sequence of bytes that is mathematically useless without the decryption key.
      </p>
      <p>
        This is meaningfully different from server-side encryption (also called "encryption at rest"),
        where the server receives your plaintext data and then encrypts it for storage using keys that
        the server itself controls. In that model, the service provider can always decrypt your data.
        With client-side encryption, only someone who holds the key — which never leaves your device —
        can read the data.
      </p>
      <p>
        The practical implication: if someone breaks into the server and steals the encrypted data, they
        have nothing useful. The ciphertext requires the key to decrypt, and the key was never on the server.
      </p>

      <h2>Symmetric vs Asymmetric Encryption</h2>
      <p>
        There are two fundamental approaches to encryption, and they serve different purposes.
      </p>
      <ul>
        <li>
          <strong>Symmetric encryption (AES)</strong> — one key encrypts the data, and the same key
          decrypts it. Fast, efficient, and suitable for encrypting large amounts of data. The challenge
          is key distribution: how do you securely share the key with whoever needs to decrypt the data?
          For personal use (encrypting your own notes), symmetric encryption is ideal — you hold the only
          key. AES (Advanced Encryption Standard) is the dominant symmetric algorithm.
        </li>
        <li>
          <strong>Asymmetric encryption (RSA, ECDH)</strong> — two mathematically linked keys: a public
          key that anyone can use to encrypt data, and a private key that only the owner holds, used for
          decryption. Solves the key distribution problem — you can share your public key openly. Much
          slower than symmetric encryption for large data. Most real-world systems use asymmetric
          encryption only to exchange a symmetric key, then switch to AES for the bulk data. This is how
          TLS (HTTPS) works.
        </li>
      </ul>

      <h2>Why AES-256 Is the Standard</h2>
      <p>
        AES-256 means AES with a 256-bit key. The 256-bit key size means there are 2<sup>256</sup> possible
        keys — a number so large that brute-forcing it is not computationally feasible with any technology
        that exists or is theoretically possible with classical computers. To put it in perspective: if
        every atom in the observable universe were a computer, checking one billion keys per second, it
        would still take longer than the age of the universe to exhaust all 2<sup>256</sup> keys.
      </p>
      <p>
        AES is also a NIST (US National Institute of Standards and Technology) standard, has been
        cryptanalyzed extensively for decades with no practical weaknesses found in the algorithm itself,
        and has hardware acceleration (AES-NI instructions) in virtually every modern CPU — making it
        both the most secure and the fastest option available. AES-GCM (Galois/Counter Mode) is the
        recommended variant because it provides both encryption and authentication (detecting if the
        ciphertext was tampered with).
      </p>

      <h2>Key Derivation From Passwords</h2>
      <p>
        AES-256 requires a 256-bit (32-byte) key. Human-chosen passwords are not 32 random bytes —
        they are short strings with patterns and limited character sets. Using a password directly as
        an AES key would be catastrophically insecure. Key derivation functions (KDFs) bridge this gap.
      </p>
      <p>
        A KDF takes a password and produces a cryptographically strong key of any desired length. The
        three most important KDFs are:
      </p>
      <ul>
        <li>
          <strong>PBKDF2 (Password-Based Key Derivation Function 2)</strong> — applies an HMAC function
          thousands or hundreds of thousands of times (iterations) to the password. More iterations means
          more computational work for an attacker trying to brute-force the password. PBKDF2 is the most
          widely supported KDF and is used in WPA2 Wi-Fi security, iOS device encryption, and many web
          authentication systems.
        </li>
        <li>
          <strong>bcrypt</strong> — designed specifically for password hashing with a deliberately slow
          computation. Has a "cost factor" that controls how slow it is. Widely used for storing user
          passwords in databases but not typically used for deriving AES keys.
        </li>
        <li>
          <strong>scrypt</strong> — adds memory hardness on top of computational cost. An attacker using
          specialized hardware (ASICs or GPUs) can run PBKDF2 cheaply in parallel; scrypt requires so
          much memory per computation that parallel attacks become expensive. Used in some cryptocurrency
          systems and newer security applications.
        </li>
      </ul>
      <p>
        All good encryption systems also use a <strong>salt</strong> — a random value combined with the
        password before key derivation, so that two users with the same password produce different keys,
        and pre-computed "rainbow table" attacks are defeated.
      </p>

      <h2>What "No Server Sees Your Data" Actually Means</h2>
      <p>
        When a tool claims "no server sees your data," it means the plaintext never leaves your browser.
        The JavaScript running in your browser performs the encryption locally, and only the ciphertext
        (the encrypted output) would ever be transmitted — and only if you choose to transmit it.
      </p>
      <p>
        The <a href="/tools/text-encryption">BrowseryTools Text Encryption tool</a> goes further: nothing
        is transmitted at all. The entire operation is local. You can verify this by opening your browser's
        Developer Tools, switching to the Network tab, and observing that no requests are made when you
        encrypt or decrypt. The tool uses the Web Crypto API — a browser-native cryptographic library
        built into every modern browser — which means the cryptography is not custom JavaScript code;
        it is the same trusted implementation your browser uses for HTTPS connections.
      </p>

      <h2>Common Misconceptions About Browser Encryption</h2>
      <ul>
        <li>
          <strong>"HTTPS already encrypts everything"</strong> — HTTPS encrypts data in transit between
          your browser and the server. Once the data reaches the server, it is decrypted and stored
          in plaintext (or re-encrypted with server-controlled keys). Client-side encryption protects
          the data from the server itself, not just from network interception.
        </li>
        <li>
          <strong>"The JavaScript could be changed to steal my data"</strong> — true for any web application.
          This is why open-source, audited tools are preferable to opaque ones for sensitive use cases.
          For maximum security, download the tool and run it offline.
        </li>
        <li>
          <strong>"Browser encryption is weak"</strong> — browser encryption using the Web Crypto API
          and AES-256-GCM is the same algorithm used by enterprise security software and operating system
          full-disk encryption. The algorithm is not weaker because it runs in a browser.
        </li>
        <li>
          <strong>"If I forget the password, the data is recoverable"</strong> — it is not. Client-side
          encryption provides no recovery mechanism. The data is mathematically unrecoverable without the
          key. This is a feature, not a bug — but it requires careful key management.
        </li>
      </ul>

      <h2>Practical Use Cases</h2>
      <ul>
        <li><strong>Encrypting sensitive notes</strong> — medical information, financial account details, or personal journal entries you want to store in a cloud notes app without trusting the provider</li>
        <li><strong>Protecting sensitive text in documents</strong> — embedding encrypted credentials or secrets in a document that will be shared, where only the recipient who knows the password can read them</li>
        <li><strong>Sending private messages through public channels</strong> — encrypt a message, share the ciphertext in a public channel, and share the password through a separate private channel</li>
        <li><strong>Secure backups</strong> — encrypting exported data before storing it on an untrusted backup service</li>
      </ul>

      <h2>Limitations of Client-Side Encryption</h2>
      <p>
        Client-side encryption is powerful but not a complete security solution:
      </p>
      <ul>
        <li><strong>Weak passwords defeat strong encryption</strong> — AES-256 with the password "hello123" provides almost no protection against a determined attacker who can run dictionary attacks</li>
        <li><strong>Device compromise</strong> — if an attacker controls your device (malware, keylogger), they can capture data before it is encrypted or intercept the key</li>
        <li><strong>No sharing without key exchange</strong> — sharing encrypted data with someone else requires securely sharing the key, which is a separate problem</li>
        <li><strong>No search or indexing</strong> — encrypted data cannot be searched, sorted, or processed without decrypting it first</li>
      </ul>
    </div>
  );
}
