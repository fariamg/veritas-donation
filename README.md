# 🌟 Veritas Donation Platform

> **Transparent Blockchain-Powered Donation Platform**  
> A comprehensive demonstration of advanced Web2 & Web3 engineering capabilities

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0-red)](https://nestjs.com/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8-363636)](https://soliditylang.org/)
[![Rust](https://img.shields.io/badge/Rust-ZK_Proofs-orange)](https://www.rust-lang.org/)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Implementation Roadmap](#-implementation-roadmap)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Veritas Donation Platform** is an enterprise-grade, blockchain-integrated donation system that bridges Web2 and Web3 technologies to provide unprecedented transparency, security, and verifiability in charitable donations.

This project demonstrates:

- ✅ **Advanced Microservices Architecture** with NestJS
- ✅ **Zero-Knowledge Proof Integration** for privacy-preserving verification
- ✅ **Smart Contract Development** with Solidity for immutable donation records
- ✅ **Production-Ready Backend** with PostgreSQL, RabbitMQ, and Docker
- ✅ **Enterprise Security Patterns** including JWT, input validation, and audit logging

### 🌐 The Problem We Solve

Traditional donation platforms suffer from:

- **Lack of Transparency**: Donors don't know where their money goes
- **Trust Issues**: No verifiable proof of fund allocation
- **Privacy Concerns**: Donor information often exposed
- **Centralized Control**: Single points of failure and manipulation

### 💡 Our Solution

Veritas combines the best of Web2 and Web3:

- **Blockchain Immutability**: Every donation recorded on-chain
- **Zero-Knowledge Proofs**: Verify donations without revealing donor identity
- **Microservices Scalability**: Handle millions of transactions
- **Real-time Transparency**: Track donation flow from donor to beneficiary

---

## ✨ Key Features

### 🔐 Web2 Backend (Current Phase)

- **Microservices Architecture**: API Gateway + Domain-specific services
- **Message Queue Integration**: RabbitMQ for async communication
- **Database Management**: PostgreSQL with Prisma ORM
- **JWT Authentication**: Secure, stateless authentication
- **Validation & Error Handling**: Comprehensive input validation
- **Docker Containerization**: Easy deployment and scaling

### ⛓️ Web3 Integration (In Development)

- **Smart Contracts**: Solidity-based donation management
- **Zero-Knowledge Proofs**: Rust-based ZK circuits for privacy
- **Wallet Integration**: MetaMask, WalletConnect support
- **IPFS Storage**: Decentralized document storage
- **Event Indexing**: Real-time blockchain event tracking

### 🎨 Frontend (Phase 2)

- **Modern React/Next.js**: Server-side rendering
- **Web3 Components**: Wallet connection, transaction signing
- **Real-time Updates**: WebSocket integration
- **Responsive Design**: Mobile-first approach

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  (Web Frontend - Phase 2) | (Mobile Apps - Future)              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (NestJS)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   Auth   │  │  Users   │  │Donations │  │ Reports  │       │
│  │Controller│  │Controller│  │Controller│  │Controller│       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│         │              │              │              │          │
│         └──────────────┴──────────────┴──────────────┘          │
│                         │                                       │
│                    JWT Guards & Interceptors                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼ (RabbitMQ)
┌─────────────────────────────────────────────────────────────────┐
│                    MICROSERVICES LAYER                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   User      │  │  Donation   │  │  Blockchain │            │
│  │  Service    │  │   Service   │  │   Service   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│         │                 │                 │                   │
└─────────┼─────────────────┼─────────────────┼───────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │  PostgreSQL  │  │   Ethereum   │
│   (Users)    │  │ (Donations)  │  │   Network    │
└──────────────┘  └──────────────┘  └──────────────┘
                                             │
                                             ▼
                              ┌──────────────────────────┐
                              │   Smart Contracts        │
                              │  • DonationManager.sol   │
                              │  • TokenVault.sol        │
                              │  • ZKVerifier.sol        │
                              └──────────────────────────┘
                                             │
                                             ▼
                              ┌──────────────────────────┐
                              │    ZK Proof System       │
                              │  (Rust-based circuits)   │
                              │  • Donor Privacy         │
                              │  • Amount Verification   │
                              └──────────────────────────┘
```

### Communication Patterns

```
┌──────────┐      HTTP/REST      ┌─────────────┐
│  Client  │ ───────────────────► │ API Gateway │
└──────────┘                      └─────────────┘
                                         │
                                         │ RabbitMQ (Async)
                                         ▼
                          ┌──────────────────────────┐
                          │   Microservices Layer    │
                          └──────────────────────────┘
                                         │
                                         │ Web3.js / ethers.js
                                         ▼
                          ┌──────────────────────────┐
                          │   Blockchain Network     │
                          └──────────────────────────┘
```

---

## 🛠️ Technology Stack

### Backend (Web2)

| Category             | Technology              | Purpose                           |
| -------------------- | ----------------------- | --------------------------------- |
| **Framework**        | NestJS 11.x             | Microservices architecture        |
| **Language**         | TypeScript 5.9          | Type safety & modern JS           |
| **Database**         | PostgreSQL 16           | Relational data storage           |
| **ORM**              | Prisma 6.x              | Type-safe database access         |
| **Message Queue**    | RabbitMQ                | Async microservices communication |
| **Authentication**   | JWT + Passport          | Stateless auth & authorization    |
| **Validation**       | class-validator, Joi    | Input validation & env config     |
| **Containerization** | Docker & Docker Compose | Development & deployment          |
| **Monorepo**         | Nx 21.x                 | Workspace management              |

### Blockchain (Web3)

| Category            | Technology                 | Purpose                       |
| ------------------- | -------------------------- | ----------------------------- |
| **Smart Contracts** | Solidity 0.8.x             | On-chain donation logic       |
| **Development**     | Hardhat / Foundry          | Contract testing & deployment |
| **Network**         | Ethereum (Sepolia testnet) | Blockchain infrastructure     |
| **Web3 Library**    | ethers.js / web3.js        | Blockchain interaction        |
| **IPFS**            | IPFS / Pinata              | Decentralized storage         |

### Zero-Knowledge Proofs

| Category         | Technology                  | Purpose                  |
| ---------------- | --------------------------- | ------------------------ |
| **ZK Framework** | Rust (circom alternative)   | Circuit design           |
| **Library**      | bellman / arkworks          | ZK proof generation      |
| **Verification** | Solidity verifier contracts | On-chain ZK verification |

### Frontend (Phase 2)

| Category      | Technology              | Purpose             |
| ------------- | ----------------------- | ------------------- |
| **Framework** | Next.js 14              | React SSR framework |
| **Styling**   | TailwindCSS             | Utility-first CSS   |
| **Wallet**    | RainbowKit / Web3Modal  | Wallet connection   |
| **State**     | Zustand / Redux Toolkit | State management    |

---

## 📁 Project Structure

```
veritas-donation/
├── meu-projeto-doacao/          # Main monorepo workspace
│   ├── apps/
│   │   ├── api-gateway/         # 🚪 HTTP Gateway Service
│   │   │   ├── src/
│   │   │   │   ├── auth/        # JWT authentication module
│   │   │   │   ├── users/       # User management endpoints
│   │   │   │   ├── donations/   # Donation endpoints (planned)
│   │   │   │   ├── config/      # Env validation (Joi)
│   │   │   │   ├── guards/      # Auth guards
│   │   │   │   ├── interceptors/# Error transformation
│   │   │   │   └── filters/     # Global exception handling
│   │   │   └── project.json
│   │   │
│   │   ├── user-service/        # 👤 User Microservice
│   │   │   ├── src/
│   │   │   │   ├── users/       # User business logic
│   │   │   │   ├── prisma.service.ts
│   │   │   │   └── config/      # Service configuration
│   │   │   ├── prisma/
│   │   │   │   ├── schema.prisma
│   │   │   │   └── migrations/
│   │   │   └── project.json
│   │   │
│   │   ├── donation-service/    # 💰 Donation Microservice (planned)
│   │   ├── blockchain-service/  # ⛓️ Web3 Integration Service (planned)
│   │   └── *-e2e/              # E2E test suites
│   │
│   ├── libs/
│   │   └── shared/              # 📦 Shared libraries
│   │       └── src/
│   │           ├── dto/         # Common DTOs
│   │           └── interfaces/  # Shared interfaces
│   │
│   ├── contracts/               # 📜 Smart Contracts (planned)
│   │   ├── src/
│   │   │   ├── DonationManager.sol
│   │   │   ├── TokenVault.sol
│   │   │   └── ZKVerifier.sol
│   │   ├── test/
│   │   ├── scripts/
│   │   └── hardhat.config.ts
│   │
│   ├── zk-circuits/             # 🔐 Zero-Knowledge Proofs (planned)
│   │   ├── src/
│   │   │   ├── donor_privacy.rs
│   │   │   └── amount_proof.rs
│   │   ├── Cargo.toml
│   │   └── tests/
│   │
│   ├── docker-compose.yml       # 🐳 Infrastructure setup
│   ├── nx.json                  # Nx workspace config
│   ├── package.json
│   └── tsconfig.base.json
│
├── docs/                        # 📚 Documentation
│   ├── API.md
│   ├── SMART_CONTRACTS.md
│   └── ZK_PROOFS.md
│
├── IMPLEMENTATION_GUIDE.md      # 📋 Step-by-step build guide
├── SECURITY-CHECKLIST.md        # 🔒 Security guidelines
└── README.md                    # This file
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Docker** & Docker Compose
- **PostgreSQL** 16.x (or use Docker)
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/fariamg/veritas-donation.git
   cd veritas-donation/meu-projeto-doacao
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   # API Gateway
   cp apps/api-gateway/.env.example apps/api-gateway/.env

   # User Service
   cp apps/user-service/.env.example apps/user-service/.env
   ```

4. **Start infrastructure (PostgreSQL + RabbitMQ)**

   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**

   ```bash
   npx nx run user-service:prisma-migrate
   ```

6. **Start services**

   ```bash
   # Start API Gateway
   npx nx serve api-gateway

   # Start User Service (in another terminal)
   npx nx serve user-service
   ```

7. **Verify services are running**
   - API Gateway: http://localhost:3000
   - User Service: http://localhost:3001
   - RabbitMQ Management: http://localhost:15672 (guest/guest)

### Quick Test

```bash
# Register a new user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "donor@example.com",
    "name": "John Doe",
    "password": "SecurePass123!"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "donor@example.com",
    "password": "SecurePass123!"
  }'
```

---

## 🗺️ Implementation Roadmap

### ✅ Phase 1: Backend Foundation (COMPLETED)

- [x] Nx monorepo setup
- [x] API Gateway with NestJS
- [x] User microservice with Prisma
- [x] RabbitMQ integration
- [x] JWT authentication
- [x] Input validation & error handling
- [x] Docker containerization

### 🚧 Phase 2: Donation System (IN PROGRESS)

- [ ] Donation microservice
- [ ] Campaign management
- [ ] Payment integration (Stripe/PayPal)
- [ ] Notification service (email/SMS)
- [ ] Admin dashboard API

### 📅 Phase 3: Blockchain Integration (PLANNED)

- [ ] Smart contract development (Solidity)
  - [ ] DonationManager contract
  - [ ] TokenVault for fund management
  - [ ] Access control & governance
- [ ] Hardhat/Foundry setup
- [ ] Contract testing & auditing
- [ ] Deploy to testnet (Sepolia)
- [ ] Blockchain service (Web3 integration)
- [ ] Event indexing & synchronization

### 📅 Phase 4: Zero-Knowledge Proofs (PLANNED)

- [ ] ZK circuit design (Rust)
- [ ] Donor privacy circuit
- [ ] Donation amount verification
- [ ] ZK verifier smart contract
- [ ] Integration with donation flow

### 📅 Phase 5: Frontend Development (FUTURE)

- [ ] Next.js application setup
- [ ] Wallet connection (MetaMask, WalletConnect)
- [ ] Donation interface
- [ ] Campaign discovery
- [ ] Transaction history
- [ ] Admin dashboard

### 📅 Phase 6: Production & Scaling (FUTURE)

- [ ] Kubernetes deployment
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Monitoring & observability (Prometheus, Grafana)
- [ ] Load testing
- [ ] Security audit
- [ ] Mainnet deployment

For detailed implementation steps, see [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)

---

## 🔒 Security

Security is paramount in donation platforms. We implement:

### Backend Security

- ✅ **JWT Authentication**: Secure stateless authentication
- ✅ **Input Validation**: class-validator on all inputs
- ✅ **SQL Injection Prevention**: Prisma ORM with parameterized queries
- ✅ **CORS Configuration**: Restricted origins
- ✅ **Rate Limiting**: Prevent abuse (planned)
- ✅ **Helmet.js**: Security headers
- ✅ **Environment Validation**: Joi schema validation

### Blockchain Security

- 🔄 **Smart Contract Auditing**: Multiple audit rounds (planned)
- 🔄 **Access Control**: OpenZeppelin contracts
- 🔄 **Reentrancy Guards**: Protection against attacks
- 🔄 **Upgrade Patterns**: Proxy contracts for upgradability
- 🔄 **Multi-signature Wallets**: For critical operations

### Privacy

- 🔄 **Zero-Knowledge Proofs**: Donor anonymity
- 🔄 **Data Encryption**: At rest and in transit
- 🔄 **GDPR Compliance**: User data rights

See [SECURITY-CHECKLIST.md](./meu-projeto-doacao/SECURITY-CHECKLIST.md) for complete details.

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Unit tests for specific service
npx nx test api-gateway
npx nx test user-service

# E2E tests
npx nx e2e api-gateway-e2e

# Test coverage
npx nx test user-service --coverage

# Smart contract tests (when available)
npx hardhat test
```

---

## 📊 API Documentation

API documentation is available via Swagger UI when services are running:

- **API Gateway**: http://localhost:3000/api/docs (planned)

### Key Endpoints

| Method | Endpoint             | Description          | Auth |
| ------ | -------------------- | -------------------- | ---- |
| POST   | `/api/auth/login`    | User login           | No   |
| POST   | `/api/auth/register` | User registration    | No   |
| GET    | `/api/users/profile` | Get current user     | Yes  |
| POST   | `/api/donations`     | Create donation      | Yes  |
| GET    | `/api/donations/:id` | Get donation details | Yes  |
| GET    | `/api/campaigns`     | List campaigns       | No   |

---

## 🤝 Contributing

This is currently a personal demonstration project. However, feedback and suggestions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Gabriel Faria**

- GitHub: [@fariamg](https://github.com/fariamg)
- LinkedIn: [Gabriel Faria](https://www.linkedin.com/in/gabriel-faria-73812723a/)

---

## 🙏 Acknowledgments

- **NestJS Team** for the amazing framework
- **Ethereum Foundation** for blockchain innovation
- **Prisma Team** for excellent ORM
- **Open Source Community** for invaluable tools

---

## 📈 Project Stats

![GitHub stars](https://img.shields.io/github/stars/fariamg/veritas-donation?style=social)
![GitHub forks](https://img.shields.io/github/forks/fariamg/veritas-donation?style=social)
![GitHub issues](https://img.shields.io/github/issues/fariamg/veritas-donation)
![GitHub pull requests](https://img.shields.io/github/issues-pr/fariamg/veritas-donation)

---

<div align="center">

### 🌟 If you find this project interesting, please give it a star! 🌟

**Built with ❤️ to demonstrate mastery of modern Web2 & Web3 technologies**

</div>
