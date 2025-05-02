const developmentMiddleware = (req, res, next) => {
    // Store the original hostname for later use
    req.originalHostname = req.hostname
  
    // Check if we're in development mode and using localhost
    if (process.env.NODE_ENV === "development" && (req.hostname === "localhost" || req.hostname === "127.0.0.1")) {
      // For API requests, just continue
      if (req.path.startsWith("/api")) {
        return next()
      }
  
      // For redirect requests (short links), we need special handling
      // Extract the slug from the path
      const slug = req.path.substring(1) // Remove the leading slash
  
      // If there's no slug or it's a known path, continue normally
      if (!slug || slug.includes("/") || slug === "health" || slug === "favicon.ico") {
        return next()
      }
  
      // Check if this is a short link request
      req.isLocalShortLink = true
      req.shortLinkSlug = slug
  
      // Modify the hostname to use the DEFAULT_DOMAIN for lookup purposes
      if (process.env.DEFAULT_DOMAIN) {
        req.shortLinkDomain = process.env.DEFAULT_DOMAIN
      }
    }
  
    next()
  }
  
  export default developmentMiddleware
  