if (!process.env.npm_config_user_agent?.startsWith("pnpm/")) {
  console.error("Jan UI 使用 pnpm 工作区，请运行 pnpm install。")
  process.exit(1)
}
