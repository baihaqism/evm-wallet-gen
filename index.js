import { ethers } from 'ethers';
import fs from 'fs';
import readline from 'readline';
import chalk from 'chalk';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const outputConfig = {
    address: true,
    privateKey: true,
    privateKeyWithout0x: true
};

function showBanner() {
    console.log(chalk.cyan(`
    ███████╗██╗   ██╗███╗   ███╗     ██████╗ ███████╗███╗   ██╗
    ██╔════╝██║   ██║████╗ ████║    ██╔════╝ ██╔════╝████╗  ██║
    █████╗  ██║   ██║██╔████╔██║    ██║  ███╗█████╗  ██╔██╗ ██║
    ██╔══╝  ╚██╗ ██╔╝██║╚██╔╝██║    ██║   ██║██╔══╝  ██║╚██╗██║
    ███████╗ ╚████╔╝ ██║ ╚═╝ ██║    ╚██████╔╝███████╗██║ ╚████║
    ╚══════╝  ╚═══╝  ╚═╝     ╚═╝     ╚═════╝ ╚══════╝╚═╝  ╚═══╝
    `));
    console.log(chalk.yellow('    🔑 EVM Address Generator v1.0.0'));
    console.log(chalk.gray('    ----------------------------------------'));
    console.log(chalk.gray('    Created by github.com/baihaqism'));
    console.log(chalk.gray('    ----------------------------------------\n'));
}

async function askOutputFormat() {
    console.log(chalk.cyan('\nSelect output format for wallet.json:'));
    
    const questions = [
        { key: 'address', text: 'Include Address?' },
        { key: 'privateKey', text: 'Include Private Key with 0x?' },
        { key: 'privateKeyWithout0x', text: 'Include Private Key without 0x?' }
    ];

    for (const q of questions) {
        await new Promise((resolve) => {
            rl.question(chalk.green(`${q.text} (y/n): `), (answer) => {
                outputConfig[q.key] = answer.toLowerCase() === 'y';
                resolve();
            });
        });
    }
}

async function generateWallets(count) {
    const wallets = [];
    console.log(chalk.cyan('\nGenerating wallets...'));
    
    for (let i = 0; i < count; i++) {
        const wallet = ethers.Wallet.createRandom();
        const walletData = {};
        
        if (outputConfig.address) walletData.address = wallet.address;
        if (outputConfig.privateKey) walletData.privateKey = wallet.privateKey;
        if (outputConfig.privateKeyWithout0x) walletData.privateKeyWithout0x = wallet.privateKey.slice(2);
        
        // Store complete data for text files
        walletData._complete = {
            address: wallet.address,
            privateKey: wallet.privateKey,
            privateKeyWithout0x: wallet.privateKey.slice(2)
        };
        
        wallets.push(walletData);
        process.stdout.write(chalk.green(`\rProgress: ${Math.round(((i + 1) / count) * 100)}%`));
    }
    console.log('\n');
    return wallets;
}

async function saveToFiles(wallets, prefix) {
    const outputDir = `output_${prefix}`;
    try {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }
    } catch (err) {
        console.log(chalk.red(`❌ Error creating directory: ${err.message}`));
        return;
    }

    const files = {
        [`${prefix}_wallet.json`]: wallets.map(w => {
            const { _complete, ...rest } = w;
            return rest;
        }),
        [`${prefix}_addresses.txt`]: wallets.map(w => w._complete.address).join('\n'),
        [`${prefix}_pkey_with_0x.txt`]: wallets.map(w => w._complete.privateKey).join('\n'),
        [`${prefix}_pkey_without_0x.txt`]: wallets.map(w => w._complete.privateKeyWithout0x).join('\n')
    };

    try {
        Object.entries(files).forEach(([filename, content]) => {
            fs.writeFileSync(
                `${outputDir}/${filename}`,
                typeof content === 'string' ? content : JSON.stringify(content, null, 2)
            );
        });
    } catch (err) {
        console.log(chalk.red(`❌ Error writing files: ${err.message}`));
        return;
    }

    return { files: Object.keys(files), dir: outputDir };
}

async function main() {
    console.clear();
    showBanner();

    await askOutputFormat();

    rl.question(chalk.green('\nEnter prefix for filenames: '), async (prefix) => {
        if (!/^[a-zA-Z0-9_-]+$/.test(prefix)) {
            console.log(chalk.red('❌ Error: Prefix contains invalid characters'));
            rl.close();
            return;
        }

        rl.question(chalk.green('\nHow many addresses to generate? '), async (count) => {
            const num = parseInt(count);
            if (isNaN(num) || num <= 0) {
                console.log(chalk.red('❌ Error: Please enter a positive number'));
                rl.close();
                return;
            }

            const wallets = await generateWallets(num);
            const { files, dir } = await saveToFiles(wallets, prefix);

            console.log(chalk.green('\n✅ Success!'));
            console.log(chalk.cyan(`\nGenerated ${num} addresses!`));
            console.log(chalk.yellow(`\nFiles saved in "${dir}" folder:`));
            files.forEach(file => {
                console.log(chalk.gray(`- ${file}`));
            });

            console.log(chalk.yellow('\nWallet.json format includes:'));
            Object.entries(outputConfig).forEach(([key, value]) => {
                console.log(chalk.gray(`- ${key}: ${value ? '✓' : '✗'}`));
            });

            console.log(chalk.gray('\nThank you for using EVM Address Generator'));
            console.log(chalk.gray('Created by github.com/baihaqism\n'));

            rl.close();
        });
    });
}

main();