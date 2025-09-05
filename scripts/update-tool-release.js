#!/usr/bin/env node

/**
 * Tool Release Date Updater
 *
 * This script helps manage tool creation dates for the "new" tag system.
 * It allows you to:
 * 1. Set a tool to "development" mode (future date)
 * 2. Release a tool (update to current date)
 * 3. List tools and their status
 * 4. Bulk update multiple tools
 */

const fs = require("fs");
const path = require("path");

const TOOLS_CONFIG_PATH = path.join(
  __dirname,
  "..",
  "src",
  "lib",
  "tools-config.ts"
);

// Helper functions
function getCurrentDate() {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
}

function getFutureDate(days = 30) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

function readToolsConfig() {
  try {
    const content = fs.readFileSync(TOOLS_CONFIG_PATH, "utf8");
    return content;
  } catch (error) {
    console.error("Error reading tools config:", error.message);
    process.exit(1);
  }
}

function writeToolsConfig(content) {
  try {
    fs.writeFileSync(TOOLS_CONFIG_PATH, content, "utf8");
    console.log("✅ Tools config updated successfully");
  } catch (error) {
    console.error("Error writing tools config:", error.message);
    process.exit(1);
  }
}

function findToolInConfig(content, toolName) {
  // Find the tool by name in the config
  const toolRegex = new RegExp(
    `name: "${toolName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`,
    "g"
  );
  return toolRegex.test(content);
}

function updateToolCreationDate(content, toolName, newDate) {
  // Find and replace the creationDate for the specific tool
  const toolPattern = new RegExp(
    `(name: "${toolName.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    )}"[\\s\\S]*?creationDate: ")[^"]*(")`,
    "g"
  );

  const updatedContent = content.replace(toolPattern, `$1${newDate}$2`);

  if (updatedContent === content) {
    throw new Error(`Tool "${toolName}" not found in config`);
  }

  return updatedContent;
}

function listTools(content) {
  console.log("\n📋 Current Tools Status:");
  console.log("=".repeat(50));

  // Extract all tools with their creation dates
  const toolMatches = content.match(
    /name: "([^"]+)"[\s\S]*?creationDate: "([^"]+)"/g
  );

  if (!toolMatches) {
    console.log("No tools found");
    return;
  }

  const currentDate = new Date();

  toolMatches.forEach((match) => {
    const nameMatch = match.match(/name: "([^"]+)"/);
    const dateMatch = match.match(/creationDate: "([^"]+)"/);

    if (nameMatch && dateMatch) {
      const toolName = nameMatch[1];
      const creationDate = dateMatch[1];
      const toolDate = new Date(creationDate);
      const diffTime = currentDate.getTime() - toolDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let status = "";
      if (diffDays < 0) {
        status = "🔧 Development (future date)";
      } else if (diffDays <= 15) {
        status = '🆕 New (shows "new" tag)';
      } else {
        status = "📅 Released";
      }

      console.log(
        `${toolName.padEnd(
          25
        )} | ${creationDate} | ${diffDays} days | ${status}`
      );
    }
  });
}

function showHelp() {
  console.log(`
🛠️  Tool Release Date Manager

Usage:
  node update-tool-release.js <command> [options]

Commands:
  list                           List all tools and their status
  set-dev <tool-name> [days]     Set tool to development mode (future date)
  release <tool-name>            Release tool (set to current date)
  release-all                    Release all development tools
  help                           Show this help message

Examples:
  node update-tool-release.js list
  node update-tool-release.js set-dev "SVG Tools" 30
  node update-tool-release.js release "SVG Tools"
  node update-tool-release.js release-all

Notes:
  - Development mode sets creation date to future (default 30 days)
  - Released tools get current date and show "new" tag for 15 days
  - Tool names must match exactly (case-sensitive)
`);
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === "help") {
    showHelp();
    return;
  }

  const content = readToolsConfig();

  switch (command) {
    case "list":
      listTools(content);
      break;

    case "set-dev": {
      const toolName = args[1];
      const days = parseInt(args[2]) || 30;

      if (!toolName) {
        console.error("❌ Tool name is required");
        console.log(
          'Usage: node update-tool-release.js set-dev "Tool Name" [days]'
        );
        process.exit(1);
      }

      if (!findToolInConfig(content, toolName)) {
        console.error(`❌ Tool "${toolName}" not found in config`);
        process.exit(1);
      }

      const futureDate = getFutureDate(days);
      const updatedContent = updateToolCreationDate(
        content,
        toolName,
        futureDate
      );
      writeToolsConfig(updatedContent);
      console.log(`🔧 Set "${toolName}" to development mode (${futureDate})`);
      break;
    }

    case "release": {
      const toolName = args[1];

      if (!toolName) {
        console.error("❌ Tool name is required");
        console.log('Usage: node update-tool-release.js release "Tool Name"');
        process.exit(1);
      }

      if (!findToolInConfig(content, toolName)) {
        console.error(`❌ Tool "${toolName}" not found in config`);
        process.exit(1);
      }

      const currentDate = getCurrentDate();
      const updatedContent = updateToolCreationDate(
        content,
        toolName,
        currentDate
      );
      writeToolsConfig(updatedContent);
      console.log(`🚀 Released "${toolName}" (${currentDate})`);
      break;
    }

    case "release-all": {
      const currentDate = getCurrentDate();
      let updatedContent = content;
      let releasedCount = 0;

      // Find all tools with future dates and release them
      const futureToolMatches = content.match(
        /name: "([^"]+)"[\s\S]*?creationDate: "([^"]+)"/g
      );

      if (futureToolMatches) {
        futureToolMatches.forEach((match) => {
          const nameMatch = match.match(/name: "([^"]+)"/);
          const dateMatch = match.match(/creationDate: "([^"]+)"/);

          if (nameMatch && dateMatch) {
            const toolName = nameMatch[1];
            const creationDate = dateMatch[1];
            const toolDate = new Date(creationDate);
            const currentDateObj = new Date();

            // If tool has future date, release it
            if (toolDate > currentDateObj) {
              updatedContent = updateToolCreationDate(
                updatedContent,
                toolName,
                currentDate
              );
              releasedCount++;
              console.log(`🚀 Released "${toolName}"`);
            }
          }
        });
      }

      if (releasedCount > 0) {
        writeToolsConfig(updatedContent);
        console.log(`\n✅ Released ${releasedCount} tool(s)`);
      } else {
        console.log("ℹ️  No development tools found to release");
      }
      break;
    }

    default:
      console.error(`❌ Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}

// Run the script
main();
