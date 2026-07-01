/**
 * Middleware to authenticate requests using an API Key
 * Validates the x-api-key header against EXTERNAL_API_KEY environment variable.
 */
export const apiKeyAuth = (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'API key is required'
      });
    }

    const validApiKey = process.env.EXTERNAL_API_KEY;

    if (!validApiKey) {
      console.error('EXTERNAL_API_KEY environment variable is not configured');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    if (apiKey !== validApiKey) {
      return res.status(403).json({
        success: false,
        message: 'Invalid API key'
      });
    }

    // Attach a mock user object so downstream controllers (e.g. streamDocument)
    // that check req.user.id for authorization will pass the checks.
    // If a controller explicitly requires a valid user ID, we inject the requested one.
    const userId = req.params.userId || req.params.id || -1;
    
    req.user = {
      id: userId,
      userId: userId,
      role: 'external_system',
      status: 'Active'
    };

    next();
  } catch (error) {
    console.error('API Key Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error occurred'
    });
  }
};
