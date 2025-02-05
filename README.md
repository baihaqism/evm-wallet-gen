# 🔑 EVM Address Generator

A streamlined Node.js CLI tool for generating multiple EVM addresses with custom prefix naming ⚡

## ✨ Features
- 🎯 Generate multiple EVM addresses instantly
- ⚙️ Customizable output format for wallet.json
- 📄 Separate text files for addresses and private keys
- 🏷️ Custom prefix for filenames and output directory

## 🚀 Installation
```bash
git clone https://github.com/baihaqism/EVM-GEN && cd EVM-GEN && npm install
```

## 💻 Usage
```bash
npm start
```

## 📁 Output Files
Files are saved in `output_[prefix]/` directory:
- 📋 `[prefix]_wallet.json` - Selected wallet data in JSON format
- 📝 `[prefix]_addresses.txt` - List of addresses
- 🔐 `[prefix]_pkey_with_0x.txt` - Private keys with 0x prefix
- 🔑 `[prefix]_pkey_without_0x.txt` - Private keys without 0x prefix
