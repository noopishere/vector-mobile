# Vector Mobile - Backend API Schema

This document defines the API schema for the Vector Mobile app backend.

## Overview

The mobile app has 3 main sections:
1. **Markets** — Prediction markets listing and trading
2. **Feed** — News articles with attached prediction markets
3. **Profile** — User portfolio, positions, and settings

---

## Authentication

### POST `/auth/login`
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "token": "string (JWT)",
  "user": {
    "id": "string",
    "email": "string",
    "username": "string",
    "avatar": "string | null",
    "createdAt": "ISO8601"
  }
}
```

### POST `/auth/register`
```json
{
  "email": "string",
  "password": "string",
  "username": "string"
}
```

### POST `/auth/refresh`
```json
{
  "refreshToken": "string"
}
```

---

## Markets

### GET `/markets`
List all prediction markets.

**Query params:**
- `category` — Filter by category (politics, sports, crypto, entertainment, etc.)
- `status` — `open` | `closed` | `resolved`
- `sort` — `volume` | `trending` | `closing_soon` | `newest`
- `limit` — Number of results (default: 20)
- `offset` — Pagination offset

**Response:**
```json
{
  "markets": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "category": "string",
      "imageUrl": "string | null",
      "status": "open | closed | resolved",
      "yesPrice": "number (0-100)",
      "noPrice": "number (0-100)",
      "volume": "number",
      "volume24h": "number",
      "liquidity": "number",
      "closesAt": "ISO8601",
      "resolvedAt": "ISO8601 | null",
      "outcome": "yes | no | null",
      "createdAt": "ISO8601",
      "source": "kalshi | polymarket | internal"
    }
  ],
  "total": "number",
  "hasMore": "boolean"
}
```

### GET `/markets/:id`
Get single market details.

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "imageUrl": "string | null",
  "status": "open | closed | resolved",
  "yesPrice": "number",
  "noPrice": "number",
  "volume": "number",
  "volume24h": "number",
  "liquidity": "number",
  "closesAt": "ISO8601",
  "resolvedAt": "ISO8601 | null",
  "outcome": "yes | no | null",
  "createdAt": "ISO8601",
  "source": "string",
  "priceHistory": [
    {
      "timestamp": "ISO8601",
      "yesPrice": "number",
      "noPrice": "number",
      "volume": "number"
    }
  ],
  "relatedNews": [
    {
      "id": "string",
      "title": "string",
      "source": "string",
      "publishedAt": "ISO8601"
    }
  ]
}
```

### GET `/markets/:id/orderbook`
Get market order book.

**Response:**
```json
{
  "bids": [
    { "price": "number", "quantity": "number" }
  ],
  "asks": [
    { "price": "number", "quantity": "number" }
  ],
  "spread": "number",
  "lastTrade": {
    "price": "number",
    "quantity": "number",
    "side": "yes | no",
    "timestamp": "ISO8601"
  }
}
```

### POST `/markets/:id/orders`
Place an order. **Requires auth.**

```json
{
  "side": "yes | no",
  "type": "market | limit",
  "quantity": "number",
  "price": "number | null (for limit orders)"
}
```

**Response:**
```json
{
  "orderId": "string",
  "status": "pending | filled | partial | cancelled",
  "filledQuantity": "number",
  "avgPrice": "number",
  "createdAt": "ISO8601"
}
```

---

## Feed

### GET `/feed`
Get news feed with attached markets.

**Query params:**
- `category` — Filter by category
- `limit` — Number of results (default: 20)
- `offset` — Pagination offset

**Response:**
```json
{
  "items": [
    {
      "id": "string",
      "type": "news",
      "title": "string",
      "summary": "string",
      "content": "string | null",
      "source": "string",
      "sourceUrl": "string",
      "imageUrl": "string | null",
      "category": "string",
      "publishedAt": "ISO8601",
      "attachedMarkets": [
        {
          "id": "string",
          "title": "string",
          "yesPrice": "number",
          "noPrice": "number",
          "volume24h": "number",
          "closesAt": "ISO8601"
        }
      ]
    }
  ],
  "total": "number",
  "hasMore": "boolean"
}
```

### GET `/feed/:id`
Get single feed item with full content.

---

## Profile / Portfolio

### GET `/profile`
Get current user profile. **Requires auth.**

**Response:**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "username": "string",
    "avatar": "string | null",
    "createdAt": "ISO8601"
  },
  "stats": {
    "totalTrades": "number",
    "winRate": "number (0-100)",
    "profitLoss": "number",
    "profitLossPercent": "number",
    "portfolioValue": "number",
    "cashBalance": "number"
  }
}
```

### GET `/profile/positions`
Get user's open positions. **Requires auth.**

**Response:**
```json
{
  "positions": [
    {
      "id": "string",
      "market": {
        "id": "string",
        "title": "string",
        "status": "open | closed | resolved",
        "yesPrice": "number",
        "closesAt": "ISO8601"
      },
      "side": "yes | no",
      "quantity": "number",
      "avgPrice": "number",
      "currentPrice": "number",
      "profitLoss": "number",
      "profitLossPercent": "number",
      "createdAt": "ISO8601"
    }
  ],
  "totalValue": "number",
  "totalProfitLoss": "number"
}
```

### GET `/profile/history`
Get user's trade history. **Requires auth.**

**Query params:**
- `limit` — Number of results
- `offset` — Pagination offset

**Response:**
```json
{
  "trades": [
    {
      "id": "string",
      "market": {
        "id": "string",
        "title": "string"
      },
      "side": "yes | no",
      "type": "buy | sell",
      "quantity": "number",
      "price": "number",
      "total": "number",
      "createdAt": "ISO8601"
    }
  ],
  "total": "number",
  "hasMore": "boolean"
}
```

### PUT `/profile`
Update user profile. **Requires auth.**

```json
{
  "username": "string | null",
  "avatar": "string (base64) | null"
}
```

---

## Categories

### GET `/categories`
Get all market categories.

**Response:**
```json
{
  "categories": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "icon": "string",
      "marketCount": "number"
    }
  ]
}
```

---

## Websocket Events

Connect to `wss://api.vector.markets/ws` for real-time updates.

### Subscribe to market
```json
{ "type": "subscribe", "channel": "market", "marketId": "string" }
```

### Price update event
```json
{
  "type": "price_update",
  "marketId": "string",
  "yesPrice": "number",
  "noPrice": "number",
  "volume": "number",
  "timestamp": "ISO8601"
}
```

### Trade event
```json
{
  "type": "trade",
  "marketId": "string",
  "side": "yes | no",
  "price": "number",
  "quantity": "number",
  "timestamp": "ISO8601"
}
```

### Position update (auth required)
```json
{
  "type": "position_update",
  "positionId": "string",
  "currentPrice": "number",
  "profitLoss": "number"
}
```

---

## Error Responses

All errors follow this format:
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object | null"
  }
}
```

Common error codes:
- `AUTH_REQUIRED` — Missing or invalid auth token
- `NOT_FOUND` — Resource not found
- `VALIDATION_ERROR` — Invalid request body
- `INSUFFICIENT_BALANCE` — Not enough funds
- `MARKET_CLOSED` — Market is not open for trading
- `RATE_LIMITED` — Too many requests

---

## Notes for Backend

1. **Data source:** Primary integration is Kalshi. Markets should sync from Kalshi API.
2. **News feed:** Aggregate from crypto/finance news APIs, match to markets by keywords/categories.
3. **Real-time:** Use Redis pub/sub for websocket broadcasting.
4. **Auth:** JWT with 15min access token, 7-day refresh token.
5. **Rate limits:** 100 req/min for authenticated, 30 req/min for public endpoints.
