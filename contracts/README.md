# ContractMind Smart Contracts

## Overview

ContractMind uses a **Hub-Aware Architecture** where smart contracts are designed to work with a centralized hub that routes all interactions while preserving user context.

## Architecture

### Key Components

1. **AgentRegistry** - Stores agent configurations and metadata
2. **ContractMindHubV2** - Central router for all contract interactions  
3. **HubAwareStaking** - Example target contract that works with the hub

### Production Pattern: Hub-Aware Contracts

#### The Challenge

When a user calls a contract through an intermediary (the Hub), the target contract receives:
- `msg.sender` = Hub address
- `tx.origin` = Actual user address

This creates a problem for contracts that need to know the actual user.

#### The Solution

We use **Hub-Aware Contracts** that intelligently determine the actual user:

```solidity
function _getUser() internal view returns (address) {
    if (hubModeEnabled && msg.sender == trustedHub) {
        // Called via hub - use tx.origin as the actual user
        return tx.origin;
    }
    // Direct call - use msg.sender
    return msg.sender;
}
```

#### Security Considerations

**Why `tx.origin` is safe here:**

1. **Trusted Hub Only** - Only the trusted hub contract can trigger `tx.origin` logic
2. **User-Initiated** - User explicitly calls the hub to interact with the contract
3. **Opt-In** - Contracts can disable hub mode at any time
4. **Transparent** - Users know they're interacting through the hub

---

## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

Deploy to Somnia Testnet using the provided script:

```shell
# With Foundry profile rpc_endpoints.somnia_testnet configured
forge script script/Deploy.s.sol:Deploy \
    --rpc-url somnia_testnet \
    --broadcast \
    --private-key $PRIVATE_KEY

# Or specify RPC directly
forge script script/Deploy.s.sol:Deploy \
    --rpc-url https://dream-rpc.somnia.network \
    --broadcast \
    --private-key $PRIVATE_KEY
```

After deployment, addresses will be written to `contracts/deployments/latest.json` and printed in the console. Use these to configure the backend `.env`.

#### Somnia Testnet Deployments (current)

- AgentRegistry: `0x318FFd8Fc398a3639Faa837307Ffdd0b9E1017c9`
- ContractMindHubV2: `0x8244777FAe8F2f4AE50875405AFb34E10164C027`
- Deployer: `0x95621720663a0DDBF121329FB0884779Ab7780B6`
- Chain ID: `50312`
- RPC: `https://dream-rpc.somnia.network`

See also `contracts/deployments/latest.json` and `contracts/deployments/somnia-testnet-manual.json`.

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
