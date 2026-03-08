#!/usr/bin/env node
/**
 * DevToys Token Counter CLI
 * Lightweight terminal utility using pure JS approximation to count text tokens offline.
 */

function countTokens(text) {
    let count = 0;
    for (let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i);
        if (code > 255) count += 2.5;
        else count += 0.25;
    }
    return Math.ceil(count);
}

function printStats(text) {
    console.log('--- DevToys Local Token Counter ---');
    console.log(`Tokens (approx): ${countTokens(text)}`);
    console.log(`Characters:      ${text.length}`);
    console.log(`Words:           ${text.trim().split(/\s+/).filter(w => w.length > 0).length}`);
}

// Logic to handle execution directly or via pipe
const args = process.argv.slice(2);
const isPiped = !process.stdin.isTTY;

// If we receive an argument directly, prioritize the argument.
// This supports: node script.js "Hello" AND curl URL | node - "Hello"
if (args.length > 0 && args[0] !== '-') {
    printStats(args.join(' '));
} else if (isPiped) {
    let inputData = '';
    process.stdin.on('data', chunk => inputData += chunk);
    process.stdin.on('end', () => {
        if (inputData.trim().length > 0) printStats(inputData);
    });
} else {
    console.log('Usage:');
    console.log('  node token-cli.js "Your text here"');
    console.log('  cat file.txt | node token-cli.js');
    console.log('  curl -sL [URL_TO_SCRIPT] | node - "Your text here"');
    process.exit(1);
}
