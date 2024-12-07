# TaxEase - Crypto Tax Reporting Made Easy

## Overview
TaxEase is a web application designed to simplify cryptocurrency tax reporting by automatically tracking, categorizing, and generating tax reports for crypto transactions. It provides a user-friendly interface for managing crypto transactions and preparing tax documentation.

## Problem Statement
Cryptocurrency users face several challenges when it comes to tax reporting:
- Difficulty tracking multiple transactions across different platforms
- Complex categorization of crypto income and expenses
- Time-consuming manual reporting processes
- Lack of standardized reporting formats
- Need for accurate transaction history and calculations

## Features
### Transaction Management
- Automatic transaction import from blockchain
- Transaction categorization (Income/Expense/Investment)
- Custom category creation
- Transaction notes and metadata
- Tax-deductible flagging

### Tax Reporting
- Customizable reporting periods
- Multiple export formats (CSV, PDF, Excel)
- Detailed transaction breakdowns
- Income and expense summaries
- Tax calculation estimates

### Analytics
- Real-time transaction monitoring
- Visual data representation
- Category distribution analysis
- Monthly trend tracking
- Performance metrics

## Technical Stack
### Frontend
- Vue 3 / Nuxt 3
- TypeScript
- Tailwind CSS
- HeadlessUI
- Chart.js
- Pinia (State Management)

### Blockchain Integration
- Request Network
- Viem
- AppKit
- WalletConnect

### Data Export
- XLSX
- jsPDF
- CSV

### Development Tools
- pnpm (Package Manager)
- ESLint
- TypeScript
- Nuxt Security

## Architecture
- Component-based architecture
- Composition API pattern
- Reactive state management
- Persistent storage
- Responsive design
- Type-safe development

## Getting Started
1. Clone the repository 
```bash
git clone https://github.com/yourusername/taxease.git
```
2. Install dependencies
```bash
pnpm install
```
3. Set up environment variables
```bash
cp .env.example .env
```
4. Run the development server
```bash
pnpm dev
```

## Deployment
The application is deployed on Vercel and can be accessed at:
[https://taxease.vercel.app](https://taxease.vercel.app)

## Contributing
We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- [Request Network](https://request.network/) for blockchain integration
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Chart.js](https://www.chartjs.org/) for data visualization
- [Nuxt](https://nuxt.com/) for the framework
- [Pinia](https://pinia.vuejs.org/) for state management

## Contact
For questions or support, please open an issue in the GitHub repository or contact the maintainers at:
[utitofonudoekong@gmail.com](mailto:utitofonudoekong@gmail.com)

## Current Roadmap
- ✅ Sepolia network integration
- ✅ WalletConnect integration
- ✅ Transaction import from blockchain
- ✅ Transaction categorization
- ✅ Tax reporting
- ✅ Tax calculation
- ✅ Tax document export
- ✅ Responsive design
- ✅ Dark/Light mode theme
- ✅ Documentation

## Future Roadmap
- [ ] Multi-wallet support
- [ ] Additional blockchain network integration
- [ ] Advanced tax calculation rules
- [ ] API integration for tax services
- [ ] Multi-language support
- [ ] API key management for external integrations