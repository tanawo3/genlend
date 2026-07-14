# GenLend Protocol

GenLend is a decentralized lending protocol designed to evaluate loan proposals on the GenLayer Network securely. It utilizes GenLayer Smart Contracts (Python) to read text-based proposals and perform validator consensus to evaluate the safety and legitimacy of loan requests.

## Features

- **Consensus-Driven Evaluation**: Uses GenLayer validators to form consensus on the safety of text-based loan proposals.
- **On-Chain Ledger**: View all active loan applications, requested amounts, and consensus statuses directly from the smart contract state.
- **Modern Interface**: Built with React and Tailwind CSS featuring a clean, dark, and highly professional aesthetic.
- **Web3 Wallet Support**: Directly interacts with the GenLayer Studio Network using `genlayer-js`.

## Architecture

- **Frontend**: React + Vite + Tailwind CSS
- **Blockchain SDK**: `genlayer-js`
- **Smart Contracts**: GenLayer Python VM

## How to Run

1. **Connect Wallet**: Make sure your Web3 wallet (MetaMask, OKX) is configured to connect to the GenLayer Studio Network.
2. **Deploy Contract**: Click "Initialize Contract" to deploy `LendingProtocol.py` to the network.
3. **Interact**: 
   - Create new loan applications by setting the applicant address and detailed rationale.
   - Run the protocol evaluation to have validators analyze the proposal.

