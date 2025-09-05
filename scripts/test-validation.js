#!/usr/bin/env node

/**
 * Test script to verify the validation system works correctly
 */

const { validateTools } = require("./validate-tools");

console.log("🧪 Testing tools validation system...\n");

try {
  const success = validateTools();

  if (success) {
    console.log("\n🎉 Validation test passed!");
    process.exit(0);
  } else {
    console.log("\n❌ Validation test failed!");
    process.exit(1);
  }
} catch (error) {
  console.error("\n💥 Validation test error:", error.message);
  process.exit(1);
}
