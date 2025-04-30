const axios = require('axios');
const fs = require('fs').promises;
const chalk = require('chalk');
const cfonts = require('cfonts');
const { HttpProxyAgent } = require('http-proxy-agent');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');
const readlineSync = require('readline-sync');

// Display Banner
cfonts.say('Airdrop 888', {
    font: 'block',
    align: 'center',
    colors: ['cyan', 'yellow'],
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 1,
    space: true
});

console.log(chalk.greenBright('Script coded by - @balveerxyz | Channel Tele: t.me/airdroplocked | Auto Mining & Clear All Task\n'));

// Read proxies from proxy.txt
async function loadProxies() {
    try {
        const data = await fs.readFile('proxy.txt', 'utf8');
        const proxies = data.split('\n').map(line => line.trim()).filter(line => line);
        console.log(chalk.green(`✅ Loaded ${proxies.length} proxies from proxy.txt`));
        return proxies;
    } catch (error) {
        console.log(chalk.red(`❌ Error loading proxies: ${error.message}`));
        return [];
    }
}

// Read tokens from tokens.txt
async function loadTokens() {
    try {
        const data = await fs.readFile('tokens.txt', 'utf8');
        const tokens = data.split('\n').map(line => line.trim()).filter(line => line);
        console.log(chalk.green(`✅ Loaded ${tokens.length} tokens from tokens.txt`));
        return tokens;
    } catch (error) {
        console.log(chalk.red(`❌ Error loading tokens: ${error.message}`));
        return [];
    }
}

// Get proxy agent
function getProxyAgent(proxy) {
    if (proxy.startsWith('http://')) {
        return new HttpProxyAgent(proxy);
    } else if (proxy.startsWith('https://')) {
        return new HttpsProxyAgent(proxy);
    } else if (proxy.startsWith('socks4://') || proxy.startsWith('socks5://')) {
        return new SocksProxyAgent(proxy);
    }
    return null;
}

// Get loyalty data (check tasks and mining status)
async function getLoyaltyData(token, proxy, proxies, proxyIndex) {
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` },
            ...(proxy ? { httpsAgent: getProxyAgent(proxy) } : {})
        };
        console.log(chalk.blue(`ℹ️ Fetching loyalty data for token...`));
        const response = await axios.get('https://api.stobix.com/v1/loyalty', config);
        console.log(chalk.green(`✅ Loyalty data retrieved: ${JSON.stringify(response.data.user)}`));
        return response.data;
    } catch (error) {
        console.log(chalk.red(`❌ Error fetching loyalty data: ${error.response?.status || ''} ${error.message}`));
        if (proxies.length > 0 && proxy) {
            const newProxyIndex = (proxyIndex + 1) % proxies.length;
            console.log(chalk.yellow(`🔄 Switching to proxy: ${proxies[newProxyIndex]}`));
            return await getLoyaltyData(token, proxies[newProxyIndex], proxies, newProxyIndex);
        }
        throw error;
    }
}

// Complete a task
async function completeTask(token, taskId, proxy, proxies, proxyIndex) {
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` },
            ...(proxy ? { httpsAgent: getProxyAgent(proxy) } : {})
        };
        console.log(chalk.blue(`ℹ️ Completing task: ${taskId}...`));
        const response = await axios.post('https://api.stobix.com/v1/loyalty/tasks/claim', 
            { taskId }, 
            config
        );
        console.log(chalk.green(`✅ Task ${taskId} completed! Points: ${response.data.points}`));
        return response.data;
    } catch (error) {
        console.log(chalk.red(`❌ Error completing task ${taskId}: ${error.response?.status || ''} ${error.message}`));
        if (proxies.length > 0 && proxy) {
            const newProxyIndex = (proxyIndex + 1) % proxies.length;
            console.log(chalk.yellow(`🔄 Switching to proxy: ${proxies[newProxyIndex]}`));
            return await completeTask(token, taskId, proxies[newProxyIndex], proxies, newProxyIndex);
        }
        console.log(chalk.yellow(`⚠️ Skipping task ${taskId} due to error`));
        return null;
    }
}

// Start mining
async function startMining(token, proxy, proxies, proxyIndex) {
    try {
        const config = {
            headers: { Authorization: `Bearer ${token}` },
            ...(proxy ? { httpsAgent: getProxyAgent(proxy) } : {})
        };
        console.log(chalk.blue(`ℹ️ Starting mining...`));
        const response = await axios.post('https://api.stobix.com/v1/loyalty/points/mine', 
            {}, 
            config
        );
        console.log(chalk.green(`✅ Mining started! Amount: ${response.data.amount} | Claim at: ${response.data.claimAt}`));
        return response.data;
    } catch (error) {
        console.log(chalk.red(`❌ Error starting mining: ${error.response?.status || ''} ${error.message}`));
        if (proxies.length > 0 && proxy) {
            const newProxyIndex = (proxyIndex + 1) % proxies.length;
            console.log(chalk.yellow(`🔄 Switching to proxy: ${proxies[newProxyIndex]}`));
            return await startMining(token, proxies[newProxyIndex], proxies, newProxyIndex);
        }
        console.log(chalk.yellow(`⚠️ Skipping mining due to error`));
        return null;
    }
}

// Process a single token (check tasks, complete tasks, start mining)
async function processToken(token, useProxy, proxies, proxyIndex, isFirstToken) {
    try {
        console.log(chalk.cyanBright(`\n🔄 Processing token ${token.slice(0, 10)}... (${proxyIndex + 1}/${proxies.length || 1})`));
        
        // Get loyalty data
        const loyaltyData = await getLoyaltyData(token, useProxy ? proxies[proxyIndex] : null, proxies, proxyIndex);
        
        // Check and complete tasks
        const tasks = loyaltyData.tasks || [];
        for (const task of tasks) {
            if (task.claimedAt) {
                console.log(chalk.blue(`ℹ️ Task ${task.id} already completed`));
                continue;
            }
            await completeTask(token, task.id, useProxy ? proxies[proxyIndex] : null, proxies, proxyIndex);
        }

        // Check mining status and start mining if needed
        const { miningStartedAt, miningClaimAt } = loyaltyData.user;
        if (miningStartedAt && miningClaimAt && new Date(miningClaimAt) > new Date()) {
            console.log(chalk.blue(`ℹ️ Mining already active until ${miningClaimAt}`));
        } else {
            const miningData = await startMining(token, useProxy ? proxies[proxyIndex] : null, proxies, proxyIndex);
            if (miningData && isFirstToken) {
                return miningData.claimAt; // Return claimAt for the first token
            }
        }

        console.log(chalk.green(`🎉 Token ${token.slice(0, 10)}... processed successfully!`));
        return null;
    } catch (error) {
        console.log(chalk.red(`❌ Failed to process token ${token.slice(0, 10)}...: ${error.message}`));
        return null;
    }
}

// Format time remaining
function formatTimeRemaining(claimAt) {
    const now = new Date();
    const claimDate = new Date(claimAt);
    const diffMs = claimDate - now;
    if (diffMs <= 0) return "Mining ready now! ⏳";

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m ⏳`;
}

// Main function
async function main() {
    // Prompt user for proxy usage
    const useProxy = readlineSync.question(chalk.cyan('Mau menggunakan proxy? (y/n): ')).toLowerCase() === 'y';

    // Load proxies and tokens
    const proxies = await loadProxies();
    const tokens = await loadTokens();

    if (tokens.length === 0) {
        console.log(chalk.red('❌ No tokens found in tokens.txt. Exiting...'));
        return;
    }

    let firstTokenClaimAt = null;

    // Process each token
    for (let i = 0; i < tokens.length; i++) {
        const proxyIndex = proxies.length > 0 ? i % proxies.length : 0;
        const isFirstToken = i === 0;
        const claimAt = await processToken(tokens[i], useProxy && proxies.length > 0, proxies, proxyIndex, isFirstToken);
        if (isFirstToken && claimAt) {
            firstTokenClaimAt = claimAt;
        }
    }

    // Display time remaining based on the first token
    if (firstTokenClaimAt) {
        console.log(chalk.greenBright(`\n🎉 All tokens processed! Times remaining for next mining cycle: ${formatTimeRemaining(firstTokenClaimAt)}`));
    } else {
        console.log(chalk.greenBright('\n🎉 All tokens processed! Unable to determine next mining cycle time.'));
    }
}

main().catch(error => {
    console.log(chalk.red(`❌ Fatal error: ${error.message}`));
});