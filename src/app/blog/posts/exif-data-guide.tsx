export default function Content() {
  return (
    <div>
      <p>
        Every photo you take with a modern smartphone or digital camera embeds a detailed log of metadata
        directly inside the image file. This metadata — called EXIF data — records where you were standing,
        exactly what time you pressed the shutter, which device you used, and dozens of technical settings.
        Most people have no idea it exists. Many have no idea how specific it is. This guide explains what
        EXIF data captures, what the privacy implications are, and how to view or remove it.
      </p>
      <p>
        You can inspect the EXIF metadata in any photo using the{" "}
        <a href="/tools/exif-viewer">BrowseryTools EXIF Viewer</a> — free, no sign-up, and the image
        never leaves your browser.
      </p>

      <h2>What Is EXIF Data?</h2>
      <p>
        EXIF stands for Exchangeable Image File Format. It was defined in 1995 by the Japan Electronic
        Industries Development Association (JEIDA) and later standardized by JEITA. The EXIF specification
        defines a set of metadata tags that can be embedded in JPEG, TIFF, and HEIC image files. Every
        tag has a standardized meaning, making EXIF data machine-readable and consistent across devices
        and software.
      </p>
      <p>
        The metadata is stored in a header section of the image file, before the image data itself. It
        does not affect how the image looks — it is invisible to anyone just viewing the photo. But it is
        trivially readable by any software that knows where to look, and it is transmitted intact whenever
        you share the file.
      </p>

      <h2>What Gets Recorded</h2>
      <p>
        The range of information stored in EXIF data is broader than most people realize:
      </p>
      <ul>
        <li>
          <strong>GPS coordinates</strong> — Latitude and longitude, often with altitude and GPS precision
          data. When location services are enabled on your phone, this records the exact coordinates where
          the photo was taken — typically accurate to within a few meters. Some cameras also record the
          compass direction the camera was pointing.
        </li>
        <li>
          <strong>Device make and model</strong> — The camera manufacturer and model number (e.g.,
          "Apple iPhone 15 Pro Max" or "Canon EOS R5"). For smartphones, this identifies the exact device.
        </li>
        <li>
          <strong>Device serial number</strong> — Many cameras record the camera body's serial number in
          EXIF data. This is a unique identifier that can be used to prove a specific device took a specific
          photo — useful in legal contexts, and concerning in others.
        </li>
        <li>
          <strong>Date and time</strong> — The precise timestamp when the photo was taken, typically stored
          in local time and sometimes also in UTC. Includes seconds.
        </li>
        <li>
          <strong>Camera settings</strong> — Aperture (f-stop), shutter speed, ISO sensitivity, focal
          length, whether flash fired, exposure compensation, metering mode, white balance, and more. For
          smartphones, this includes the equivalent focal length and the specific lens used (wide, ultra-wide,
          telephoto).
        </li>
        <li>
          <strong>Lens information</strong> — Lens model and serial number on dedicated cameras with
          interchangeable lenses.
        </li>
        <li>
          <strong>Software version</strong> — The camera firmware or, for smartphone photos, the iOS or
          Android version at the time the photo was taken.
        </li>
        <li>
          <strong>Image orientation</strong> — The rotation flag that tells viewers how to orient the
          image correctly.
        </li>
        <li>
          <strong>Thumbnail</strong> — Many EXIF implementations embed a small JPEG thumbnail of the image
          within the EXIF data itself.
        </li>
      </ul>

      <h2>Real Privacy Risks</h2>
      <p>
        GPS coordinates in EXIF data represent a genuine, concrete privacy risk. When you share a photo
        taken at your home, your office, your child's school, or any location you frequent, anyone who
        receives the file can open it in an EXIF viewer and see exactly where it was taken. This is not
        theoretical — it is a default behavior of every smartphone camera when location services are
        enabled.
      </p>
      <p>
        The risk compounds with scale. If you post many photos from your daily life with EXIF data intact,
        the metadata collectively reveals your home address, workplace, daily routine, frequently visited
        locations, travel patterns, and the places you associate with regularly. This aggregated picture
        is significantly more invasive than any single coordinate.
      </p>
      <p>
        Device serial numbers and camera model information can be used to prove that two photos came from
        the same device — a consideration in legal proceedings, investigative journalism, or any situation
        where anonymity matters. If you are sharing photos anonymously, the device identifier in EXIF data
        may be the link that connects your anonymous images to your identity.
      </p>

      <h2>Famous Cases Where EXIF Data Revealed Location</h2>
      <p>
        EXIF data has exposed the location of notable people in several well-documented cases:
      </p>
      <ul>
        <li>
          In 2012, anti-virus software pioneer John McAfee was a fugitive from Belize. When Vice magazine
          reporters traveled to interview him and published a photo taken on an iPhone with GPS data intact,
          the embedded coordinates revealed his location in Guatemala within hours. He was apprehended
          shortly afterward.
        </li>
        <li>
          US military personnel have been identified and tracked through EXIF data in photos posted to
          social media, leading the US Army to issue formal guidance warning soldiers about geotagged photos.
          Images shared on military blogs revealed the locations of helicopter bases in Iraq.
        </li>
        <li>
          Whistleblowers and journalists operating in sensitive contexts have had their locations
          inadvertently revealed through EXIF data in photos shared publicly, prompting digital security
          organizations to routinely include EXIF removal in their operational security checklists.
        </li>
      </ul>

      <h2>How Social Media Platforms Handle EXIF</h2>
      <p>
        Most major social media platforms strip EXIF data from photos before displaying them, which provides
        some protection for users who do not think about this:
      </p>
      <ul>
        <li>
          <strong>Instagram, Facebook, Twitter/X</strong> — Strip EXIF data from uploaded photos. GPS
          coordinates are not visible to viewers.
        </li>
        <li>
          <strong>WhatsApp</strong> — Strips EXIF data when photos are sent through the platform.
        </li>
        <li>
          <strong>Signal</strong> — Has an option to remove metadata from photos before sending, which
          is enabled by default.
        </li>
        <li>
          <strong>Email and direct file sharing</strong> — No stripping occurs. When you email a photo
          or share it via Dropbox, Google Drive, iMessage, or AirDrop as a file, the EXIF data is preserved
          in full.
        </li>
        <li>
          <strong>Dating apps</strong> — Practices vary and are often not disclosed. Some strip metadata,
          some do not. Posting photos with location data to dating apps where your profile is visible to
          strangers carries obvious risks.
        </li>
      </ul>
      <p>
        The safest approach is not to rely on platforms stripping your data — remove it yourself before
        you share.
      </p>

      <h2>How to View EXIF Data</h2>
      <p>
        You can inspect EXIF data in several ways:
      </p>
      <ul>
        <li>
          <strong>In your browser</strong> — The{" "}
          <a href="/tools/exif-viewer">BrowseryTools EXIF Viewer</a> displays all EXIF tags in a
          readable format. Drop your photo in, and you immediately see every field including GPS
          coordinates. Nothing is uploaded.
        </li>
        <li>
          <strong>On macOS</strong> — Open the photo in Preview, then go to Tools → Show Inspector →
          GPS tab. Finder also shows basic metadata in the Get Info panel (Cmd+I).
        </li>
        <li>
          <strong>On Windows</strong> — Right-click the file, choose Properties → Details tab.
          GPS coordinates and camera information appear there.
        </li>
        <li>
          <strong>On iOS</strong> — Open the photo in the Photos app and swipe up on the photo to
          reveal the map showing where it was taken.
        </li>
      </ul>

      <h2>How to Remove EXIF Data</h2>
      <p>
        Removing EXIF data before sharing a photo is straightforward:
      </p>
      <ul>
        <li>
          <strong>BrowseryTools EXIF Viewer</strong> — The{" "}
          <a href="/tools/exif-viewer">EXIF Viewer</a> allows you to view and strip EXIF data from
          photos entirely in your browser. No upload, no account required.
        </li>
        <li>
          <strong>On Windows</strong> — Right-click the file, Properties → Details tab → "Remove
          Properties and Personal Information" link at the bottom. Creates a clean copy.
        </li>
        <li>
          <strong>On macOS</strong> — Export from Preview with the location data checkbox unchecked,
          or use the Photos app and choose to share without location.
        </li>
        <li>
          <strong>On iOS</strong> — When sharing a photo, tap "Options" at the top of the share sheet
          and toggle off "Location".
        </li>
        <li>
          <strong>Preventively</strong> — Disable location access for your camera app entirely.
          On iPhone: Settings → Privacy → Location Services → Camera → Never. This stops GPS
          coordinates from being recorded in the first place.
        </li>
      </ul>

      <h2>When EXIF Data Is Actually Useful</h2>
      <p>
        EXIF data is not purely a liability. For many people, it serves legitimate and valuable purposes:
      </p>
      <ul>
        <li>
          <strong>Photographers</strong> — EXIF data is an invaluable learning tool. After a shoot, you
          can review which aperture, shutter speed, and ISO combinations produced the best results. Lightroom
          and Capture One display EXIF data prominently precisely because photographers use it constantly.
        </li>
        <li>
          <strong>Travel photography</strong> — GPS-tagged photos automatically organize into maps and
          timelines in photo management software like Apple Photos or Google Photos, creating an effortless
          travel journal.
        </li>
        <li>
          <strong>Archivists and journalists</strong> — EXIF timestamps and location data can verify when
          and where a photo was taken — important for establishing authenticity in legal, editorial, and
          historical contexts.
        </li>
        <li>
          <strong>Insurance and legal documentation</strong> — A photo of property damage with intact
          EXIF data carries more evidentiary weight because the timestamp and location are part of the
          record.
        </li>
      </ul>
      <p>
        The key is making a conscious decision about when to share EXIF data and when to remove it,
        rather than defaulting to leaving it in place and hoping the recipient or platform will handle it.
      </p>
    </div>
  );
}
