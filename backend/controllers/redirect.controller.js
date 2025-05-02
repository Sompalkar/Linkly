import Link from "../models/link.model.js"
import Click from "../models/click.model.js"
import Domain from "../models/domain.model.js"
import bcrypt from "bcryptjs"
import UAParser from "ua-parser-js"
import geoip from "geoip-lite"

// Handle redirect
export const handleRedirect = async (req, res) => {
  try {
    const { slug } = req.params

    // Handle localhost development environment
    const host = req.get("host")
    let domainQuery = { name: host }

    // If we're in development mode and this is a local short link
    if (req.isLocalShortLink && req.shortLinkDomain) {
      domainQuery = { name: req.shortLinkDomain }
    }

    // Find domain
    const domain = await Domain.findOne(domainQuery)

    if (!domain) {
      return res.status(404).send("Domain not found")
    }

    // Find link
    const link = await Link.findOne({
      domainId: domain._id,
      slug,
      isActive: true,
    })

    if (!link) {
      return res.status(404).send("Link not found")
    }

    // Check if link has expired
    if (link.expiresAt && new Date() > link.expiresAt) {
      return res.status(410).send("Link has expired")
    }

    // Check if password protected
    if (link.password) {
      const providedPassword = req.query.password

      if (!providedPassword) {
        return res.status(401).send(`
          <html>
            <head>
              <title>Password Protected Link</title>
              <style>
                body { font-family: Arial, sans-serif; max-width: 500px; margin: 50px auto; padding: 20px; }
                input, button { padding: 10px; margin: 10px 0; width: 100%; }
                button { background: #8b5cf6; color: white; border: none; cursor: pointer; }
                .logo { font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #8b5cf6; }
              </style>
            </head>
            <body>
              <div class="logo">Linkly</div>
              <h1>Password Protected Link</h1>
              <p>This link is password protected. Please enter the password to continue.</p>
              <form method="GET">
                <input type="password" name="password" placeholder="Enter password" required />
                <button type="submit">Submit</button>
              </form>
            </body>
          </html>
        `)
      }

      const isPasswordValid = await bcrypt.compare(providedPassword, link.password)

      if (!isPasswordValid) {
        return res.status(401).send(`
          <html>
            <head>
              <title>Incorrect Password</title>
              <style>
                body { font-family: Arial, sans-serif; max-width: 500px; margin: 50px auto; padding: 20px; }
                input, button { padding: 10px; margin: 10px 0; width: 100%; }
                button { background: #8b5cf6; color: white; border: none; cursor: pointer; }
                .error { color: red; }
                .logo { font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #8b5cf6; }
              </style>
            </head>
            <body>
              <div class="logo">Linkly</div>
              <h1>Incorrect Password</h1>
              <p class="error">The password you entered is incorrect. Please try again.</p>
              <form method="GET">
                <input type="password" name="password" placeholder="Enter password" required />
                <button type="submit">Submit</button>
              </form>
            </body>
          </html>
        `)
      }
    }

    // Record click
    const parser = new UAParser(req.headers["user-agent"])
    const ua = parser.getResult()
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress
    const geo = ip ? geoip.lookup(ip.toString().split(",")[0]) : null

    const clickData = {
      linkId: link._id,
      ipAddress: ip,
      userAgent: req.headers["user-agent"],
      referrer: req.headers.referer || "direct",
      browser: ua.browser.name || "unknown",
      os: ua.os.name || "unknown",
      device: ua.device.type || "desktop",
      country: geo ? geo.country : "unknown",
      city: geo ? geo.city : "unknown",
      region: geo ? geo.region : "unknown",
    }

    // Create click asynchronously (don't wait for it)
    Click.create(clickData).catch((err) => console.error("Error recording click:", err))

    // Increment click count
    Link.findByIdAndUpdate(link._id, { $inc: { clickCount: 1 } }).catch((err) =>
      console.error("Error incrementing click count:", err),
    )

    // Build destination URL with UTM parameters if they exist
    let destinationUrl = link.originalUrl

    if (link.utmSource || link.utmMedium || link.utmCampaign) {
      const url = new URL(destinationUrl)

      if (link.utmSource) url.searchParams.append("utm_source", link.utmSource)
      if (link.utmMedium) url.searchParams.append("utm_medium", link.utmMedium)
      if (link.utmCampaign) url.searchParams.append("utm_campaign", link.utmCampaign)

      destinationUrl = url.toString()
    }

    // Redirect
    res.redirect(destinationUrl)
  } catch (error) {
    console.error("Redirect error:", error)
    res.status(500).send("Server error")
  }
}

// Handle development mode redirect for localhost
export const handleLocalRedirect = async (req, res) => {
  try {
    if (!req.isLocalShortLink || !req.shortLinkSlug) {
      return res.status(404).send("Not found")
    }

    // Use the slug from the middleware
    const slug = req.shortLinkSlug

    // Find domain (use DEFAULT_DOMAIN in development)
    const domain = await Domain.findOne({
      name: req.shortLinkDomain || process.env.DEFAULT_DOMAIN,
    })

    if (!domain) {
      return res.status(404).send("Domain not found")
    }

    // Find link
    const link = await Link.findOne({
      domainId: domain._id,
      slug,
      isActive: true,
    })

    if (!link) {
      return res.status(404).send("Link not found")
    }

    // Redirect to the original URL
    res.redirect(link.originalUrl)
  } catch (error) {
    console.error("Local redirect error:", error)
    res.status(500).send("Server error")
  }
}
