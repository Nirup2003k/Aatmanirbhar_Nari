// Isolated real-time manager using Server-Sent Events (SSE)
const clients = new Map(); // userId (number) -> Set of Express response objects

/**
 * Handle new SSE client connection
 */
const handleConnection = (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  // Set SSE Headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  // Send initial connection confirmation comment
  res.write(`: connected user ${userId}\n\n`);

  const numUserId = Number(userId);
  if (!clients.has(numUserId)) {
    clients.set(numUserId, new Set());
  }
  clients.get(numUserId).add(res);

  // Keep connection alive with periodic pings every 25 seconds
  const pingInterval = setInterval(() => {
    try {
      res.write(': ping\n\n');
    } catch {
      // Ignore write errors
    }
  }, 25000);

  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(pingInterval);
    const userClients = clients.get(numUserId);
    if (userClients) {
      userClients.delete(res);
      if (userClients.size === 0) {
        clients.delete(numUserId);
      }
    }
  });
};

/**
 * Safely send real-time event to a specific user ID
 * @param {number|string} targetUserId
 * @param {string} eventName ('NEW_ORDER' | 'ORDER_STATUS_UPDATED')
 * @param {Object} data
 */
const notifyUser = (targetUserId, eventName, data) => {
  try {
    const numUserId = Number(targetUserId);
    const userClients = clients.get(numUserId);
    if (!userClients || userClients.size === 0) return;

    const payload = JSON.stringify({
      event: eventName,
      data: data,
      timestamp: new Date().toISOString(),
    });

    const message = `event: ${eventName}\ndata: ${payload}\n\n`;

    for (const clientRes of Array.from(userClients)) {
      try {
        clientRes.write(message);
      } catch (err) {
        console.error(`Failed to push real-time event to user ${numUserId}:`, err.message);
        userClients.delete(clientRes);
      }
    }
  } catch (err) {
    // Real-time notification failure MUST NEVER disrupt main REST response execution
    console.error('Real-time notification error:', err.message);
  }
};

module.exports = {
  handleConnection,
  notifyUser,
};
