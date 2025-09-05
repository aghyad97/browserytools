#!/usr/bin/env node

/**
 * Validation script to check README.md tools list against tools-config.ts
 * This ensures the README stays in sync with the actual tools configuration
 */

const fs = require("fs");
const path = require("path");

// ANSI color codes for terminal output
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  log(`❌ ${message}`, "red");
}

function logSuccess(message) {
  log(`✅ ${message}`, "green");
}

function logWarning(message) {
  log(`⚠️  ${message}`, "yellow");
}

function logInfo(message) {
  log(`ℹ️  ${message}`, "blue");
}

// Read and parse tools-config.ts
function loadToolsConfig() {
  try {
    const configPath = path.join(
      __dirname,
      "..",
      "src",
      "lib",
      "tools-config.ts"
    );
    const configContent = fs.readFileSync(configPath, "utf8");

    // Extract tools data using regex (simple approach for this script)
    const toolsRegex = /export const tools: ToolCategory\[\] = \[([\s\S]*?)\];/;
    const match = configContent.match(toolsRegex);

    if (!match) {
      throw new Error("Could not find tools configuration in tools-config.ts");
    }

    // Parse the tools configuration
    // This is a simplified parser - in a real scenario, you might want to use a proper TypeScript parser
    const toolsData = [];
    const categoryRegex =
      /category:\s*"([^"]+)",[\s\S]*?items:\s*\[([\s\S]*?)\]/g;
    let categoryMatch;

    while ((categoryMatch = categoryRegex.exec(match[1])) !== null) {
      const category = categoryMatch[1];
      const itemsContent = categoryMatch[2];

      // Parse items within the category (only non-commented items)
      const itemRegex =
        /{\s*name:\s*"([^"]+)",[\s\S]*?available:\s*(true|false)/g;
      let itemMatch;
      const items = [];

      while ((itemMatch = itemRegex.exec(itemsContent)) !== null) {
        // Check if this item is commented out by looking at the context before the match
        const beforeMatch = itemsContent.substring(0, itemMatch.index);
        const isCommentedOut =
          beforeMatch.includes("// {") || beforeMatch.includes("//{");

        if (!isCommentedOut) {
          items.push({
            name: itemMatch[1],
            available: itemMatch[2] === "true",
          });
        }
      }

      toolsData.push({
        category,
        items,
      });
    }

    return toolsData;
  } catch (error) {
    logError(`Failed to load tools configuration: ${error.message}`);
    process.exit(1);
  }
}

// Read and parse README.md
function loadReadmeTools() {
  try {
    const readmePath = path.join(__dirname, "..", "README.md");
    const readmeContent = fs.readFileSync(readmePath, "utf8");

    const tools = [];
    const lines = readmeContent.split("\n");
    let currentCategory = "";

    for (const line of lines) {
      // Match category headers (e.g., "### 🖼️ Image Tools")
      const categoryMatch = line.match(/^###\s+[^\s]+\s+(.+)$/);
      if (categoryMatch) {
        currentCategory = categoryMatch[1];
        continue;
      }

      // Match tool entries (e.g., "- **Background Removal**: AI-powered...")
      // Only match lines that are in the Features section and have proper tool descriptions
      const toolMatch = line.match(/^-\s+\*\*([^*]+)\*\*:/);
      if (toolMatch && currentCategory && line.includes(":")) {
        // Skip if this looks like a tech stack item or other non-tool content
        const toolName = toolMatch[1];
        const isTechStackItem = [
          "Framework",
          "Language",
          "Styling",
          "UI Components",
          "State Management",
          "Icons",
          "Animations",
          "Build Tool",
        ].includes(toolName);
        const isOtherNonTool = [
          "Title",
          "Description",
          "Testing",
          "Breaking Changes",
          "Screenshots",
          "GitHub Sponsors",
          "Ziina",
          "GitHub Issues",
          "Twitter",
        ].includes(toolName);

        if (!isTechStackItem && !isOtherNonTool) {
          tools.push({
            name: toolName,
            category: currentCategory,
          });
        }
      }
    }

    return tools;
  } catch (error) {
    logError(`Failed to load README: ${error.message}`);
    process.exit(1);
  }
}

// Validate tools
function validateTools() {
  logInfo("🔍 Validating tools list...\n");

  const configTools = loadToolsConfig();
  const readmeTools = loadReadmeTools();

  // Flatten config tools for easier comparison
  const configToolsFlat = [];
  configTools.forEach((category) => {
    category.items.forEach((tool) => {
      configToolsFlat.push({
        name: tool.name,
        category: category.category,
        available: tool.available,
      });
    });
  });

  let errors = 0;
  let warnings = 0;

  // Check for tools in README that are not in config
  logInfo("Checking for tools in README that are not in config...");
  const readmeToolNames = readmeTools.map((t) => t.name);
  const configToolNames = configToolsFlat.map((t) => t.name);

  const extraInReadme = readmeToolNames.filter(
    (name) => !configToolNames.includes(name)
  );
  if (extraInReadme.length > 0) {
    logError(`Tools in README but not in config: ${extraInReadme.join(", ")}`);
    errors++;
  }

  // Check for tools in config that are not in README
  logInfo("Checking for tools in config that are not in README...");
  const missingInReadme = configToolNames.filter(
    (name) => !readmeToolNames.includes(name)
  );
  if (missingInReadme.length > 0) {
    logError(
      `Tools in config but not in README: ${missingInReadme.join(", ")}`
    );
    errors++;
  }

  // Check for category mismatches
  logInfo("Checking for category mismatches...");
  const categoryMismatches = [];
  readmeTools.forEach((readmeTool) => {
    const configTool = configToolsFlat.find((t) => t.name === readmeTool.name);
    if (configTool && configTool.category !== readmeTool.category) {
      categoryMismatches.push({
        name: readmeTool.name,
        readmeCategory: readmeTool.category,
        configCategory: configTool.category,
      });
    }
  });

  if (categoryMismatches.length > 0) {
    logError("Category mismatches found:");
    categoryMismatches.forEach((mismatch) => {
      logError(
        `  ${mismatch.name}: README="${mismatch.readmeCategory}" vs Config="${mismatch.configCategory}"`
      );
    });
    errors++;
  }

  // Check for unavailable tools in README that are not properly marked as "Coming Soon"
  logInfo("Checking for unavailable tools in README...");
  const unavailableInReadme = [];

  // We need to check the actual README content to see if tools are marked as "Coming Soon"
  const readmePath = path.join(__dirname, "..", "README.md");
  const readmeContent = fs.readFileSync(readmePath, "utf8");

  readmeTools.forEach((readmeTool) => {
    const configTool = configToolsFlat.find((t) => t.name === readmeTool.name);
    if (configTool && !configTool.available) {
      // Check if this tool is properly marked as "Coming Soon" in the README
      const toolLineRegex = new RegExp(
        `- \\*\\*${readmeTool.name}\\*\\*:.*\\*\\(Coming Soon\\)\\*`
      );
      if (!toolLineRegex.test(readmeContent)) {
        unavailableInReadme.push(readmeTool.name);
      }
    }
  });

  if (unavailableInReadme.length > 0) {
    logWarning(
      `Unavailable tools in README (should be marked as "Coming Soon"): ${unavailableInReadme.join(
        ", "
      )}`
    );
    warnings++;
  }

  // Summary
  log("\n" + "=".repeat(50));
  if (errors === 0 && warnings === 0) {
    logSuccess("All tools are properly synchronized! 🎉");
  } else {
    if (errors > 0) {
      logError(`Found ${errors} error(s) that need to be fixed.`);
    }
    if (warnings > 0) {
      logWarning(`Found ${warnings} warning(s) that should be addressed.`);
    }
  }

  log(`\nTotal tools in config: ${configToolsFlat.length}`);
  log(`Total tools in README: ${readmeTools.length}`);
  log(`Available tools: ${configToolsFlat.filter((t) => t.available).length}`);
  log(
    `Unavailable tools: ${configToolsFlat.filter((t) => !t.available).length}`
  );

  return errors === 0;
}

// Main execution
if (require.main === module) {
  const success = validateTools();
  process.exit(success ? 0 : 1);
}

module.exports = { validateTools };
