async function main() {
  const Sparkle = artifacts.require("Sparkle");

  const sparkle = await Sparkle.new();
  console.log("Sparkle deployed to:", sparkle.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });