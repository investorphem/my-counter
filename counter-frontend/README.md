# Counter DApp Frontend

A beautiful React frontend for interacting with the Counter smart contract deployed on Stacks mainnet.

## Features

- 🔢 **Real-time Counter Display** - View the current counter value
- ➕➖ **Increment/Decrement** - Modify the counter value
- 👑 **Owner Controls** - Set counter value and pause/resume operations
- 🔐 **Wallet Integration** - Connect with Leather or Xverse wallet
- ⏸️ **Pause Functionality** - Owner can pause all operations
- 📊 **Status Dashboard** - View owner, pause status, and more
- 📱 **Responsive Design** - Works on desktop and mobile

## Contract Details

- **Contract ID:** `SP2GTM2ZVYXQKNYMT3MNJY49RQ2MW8Q1DGXZF8519.counter`
- **Network:** Stacks Mainnet
- **Explorer:** [View on Explorer](https://explorer.hiro.so/txid/SP2GTM2ZVYXQKNYMT3MNJY49RQ2MW8Q1DGXZF8519.counter?chain=mainnet)

## Prerequisites

- Node.js 18+ and npm
- A Stacks wallet (Leather or Xverse)
- STX tokens for transaction fees

## Installation

```bash
# Clone the repository
git clone https://github.com/investorphem/my-counter.git
cd my-counter/counter-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Usage

1. **Open the app** in your browser (usually http://localhost:5173)

2. **Connect your wallet** by clicking "Connect Wallet"

3. **Interact with the counter:**
   - Click ➕ to increment
   - Click ➖ to decrement
   - View real-time counter value

4. **Owner-only features** (if you're the contract owner):
   - Set counter to any value
   - Pause/Resume operations
   - Transfer ownership

## Building for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool
- **@stacks/connect** - Wallet connection
- **@stacks/transactions** - Blockchain interactions
- **@stacks/network** - Network configuration

## Contract Functions

### Public Functions
- `increment()` - Increase counter by 1
- `decrement()` - Decrease counter by 1
- `set-counter(value)` - Set counter to specific value (owner only)
- `toggle-pause()` - Pause/resume operations (owner only)
- `transfer-ownership(new-owner)` - Transfer contract ownership (owner only)

### Read-Only Functions
- `get-counter()` - Get current counter value
- `get-owner()` - Get contract owner address
- `is-paused()` - Check if contract is paused

## Error Codes

- `u1000` - ERR_NOT_OWNER: Caller is not the owner
- `u1001` - ERR_UNDERFLOW: Cannot decrement below 0
- `u1002` - ERR_PAUSED: Operations are paused

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ on Stacks
