# Counter DApp - Stacks Smart Contract

A full-stack decentralized application featuring an enhanced counter smart contract deployed on Stacks mainnet with a beautiful React frontend.

## Description

This project demonstrates a complete DApp built on the Stacks blockchain, featuring:

- **Smart Contract**: A Clarity smart contract with advanced features including pause functionality, owner controls, and comprehensive error handling
- **Frontend**: A modern React application with wallet integration for seamless blockchain interaction
- **Testing**: Full test coverage with 14 passing tests ensuring contract reliability
- **Production Ready**: Deployed on Stacks mainnet and ready for real-world use

The counter contract showcases key blockchain development concepts including access control, state management, and secure transaction handling. It serves as an excellent learning resource for developers entering the Stacks ecosystem.

## Live Demo

- **Contract Address**: `SP2GTM2ZVYXQKNYMT3MNJY49RQ2MW8Q1DGXZF8519.counter`
- **Network**: Stacks Mainnet
- **Explorer**: [View on Stacks Explorer](https://explorer.hiro.so/txid/SP2GTM2ZVYXQKNYMT3MNJY49RQ2MW8Q1DGXZF8519.counter?chain=mainnet)

## Features

### Smart Contract Features
- ✅ **Increment/Decrement** - Modify counter value with bounds checking
- ✅ **Pause Functionality** - Owner can pause all operations
- ✅ **Owner Controls** - Set counter to any value, transfer ownership
- ✅ **Error Handling** - Comprehensive error codes (underflow, unauthorized, paused)
- ✅ **Read-Only Functions** - Query counter, owner, and pause status
- ✅ **Clarity Version 3** - Built with latest Clarity standards

### Frontend Features
- 🔢 **Real-time Counter Display** - Auto-refreshing every 10 seconds
- 🔐 **Wallet Integration** - Connect with Leather or Xverse wallet
- 👑 **Owner Dashboard** - Special controls for contract owner
- 📊 **Status Monitoring** - View owner address and pause state
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **Beautiful UI** - Gradient design with smooth animations
- ⚡ **Loading States** - Clear feedback during transactions

## Project Structure

```
my-counter/
├── counter-frontend/          # React frontend application
│   ├── src/
│   │   ├── App.jsx           # Main application component
│   │   └── App.css           # Styling
│   ├── package.json
│   └── README.md
├── my-counter-4/              # Smart contract project
│   ├── contracts/
│   │   └── counter.clar      # Enhanced counter contract
│   ├── tests/
│   │   └── counter.test.ts   # Test suite (14 tests)
│   ├── deployments/
│   │   └── default.mainnet-plan.yaml
│   └── settings/
│       └── Mainnet.toml
└── README.md                  # This file
```

## Smart Contract

### Contract Functions

**Public Functions:**
- `increment()` - Increase counter by 1
- `decrement()` - Decrease counter by 1 (fails if counter is 0)
- `set-counter(new-value)` - Set counter to specific value (owner only)
- `toggle-pause()` - Pause/resume all operations (owner only)
- `transfer-ownership(new-owner)` - Transfer contract ownership (owner only)

**Read-Only Functions:**
- `get-counter()` - Returns current counter value
- `get-owner()` - Returns contract owner address
- `is-paused()` - Returns pause status

**Error Codes:**
- `u1000` - ERR_NOT_OWNER: Caller is not the contract owner
- `u1001` - ERR_UNDERFLOW: Cannot decrement below 0
- `u1002` - ERR_PAUSED: Operations are paused

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Clarinet CLI (for contract development)
- A Stacks wallet (Leather or Xverse)
- STX tokens for transaction fees

### Installation

```bash
# Clone the repository
git clone https://github.com/investorphem/my-counter.git
cd my-counter
```

### Running the Frontend

```bash
cd counter-frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Testing the Contract

```bash
cd my-counter-4
npm install
npm test
```

Expected output: ✅ 14 tests passing

### Contract Development

```bash
cd my-counter-4

# Check contract syntax
clarinet check

# Run tests
npm test

# Generate deployment plan
clarinet deployments generate --mainnet
```

## Usage

### For Users

1. **Visit the DApp** and click "Connect Wallet"
2. **Approve the connection** in your Stacks wallet
3. **Interact with the counter:**
   - Click ➕ to increment
   - Click ➖ to decrement
   - View real-time updates

### For Contract Owner

Additional controls available:
- **Set Counter**: Enter any value to set the counter directly
- **Pause/Resume**: Toggle operations on/off
- **Transfer Ownership**: Assign a new owner

## Deployment

### Contract Deployment

The contract is already deployed on mainnet. To deploy your own:

```bash
cd my-counter-4

# Configure your mnemonic in settings/Mainnet.toml
# Then deploy
clarinet deployments apply --mainnet
```

### Frontend Deployment

**Vercel:**
```bash
cd counter-frontend
npm install -g vercel
vercel
```

**Netlify:**
```bash
cd counter-frontend
npm run build
# Upload dist/ folder to Netlify
```

## Tech Stack

**Smart Contract:**
- Clarity (Stacks smart contract language)
- Clarinet (Development environment)
- Vitest (Testing framework)

**Frontend:**
- React 18
- Vite (Build tool)
- @stacks/connect (Wallet integration)
- @stacks/transactions (Blockchain interactions)
- @stacks/network (Network configuration)

## Testing

The contract includes comprehensive test coverage:

```bash
cd my-counter-4
npm test
```

**Test Coverage:**
- Basic operations (increment, decrement)
- Owner controls (set-counter, transfer-ownership)
- Pause functionality (toggle-pause, operations when paused)
- Error handling (underflow, unauthorized access)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built on [Stacks](https://www.stacks.co/) blockchain
- Developed with [Clarinet](https://github.com/hirosystems/clarinet)
- UI inspired by modern DApp design patterns

## Support

For questions or issues:
- Open an issue on GitHub
- Check the [Stacks documentation](https://docs.stacks.co/)
- Join the [Stacks Discord](https://discord.gg/stacks)

## Roadmap

Future enhancements planned:
- [ ] Multi-counter support
- [ ] Counter history/analytics
- [ ] NFT rewards for milestones
- [ ] Social features (leaderboard)
- [ ] Mobile app version

---

**Built with ❤️ on Stacks** | [View Contract](https://explorer.hiro.so/txid/SP2GTM2ZVYXQKNYMT3MNJY49RQ2MW8Q1DGXZF8519.counter?chain=mainnet) | [Live Demo](#)
