# Jan UI

可复制使用的 React 组件源码库。通过 GitHub 分享代码，支持 shadcn CLI 直接从仓库安装。提供精简组件文档站，不需要部署 Registry 服务器，也不申请公共命名空间。

## 本地运行

需要 Node.js 22.14+ 与 pnpm 11.22.0。在下载或克隆的仓库根目录执行：

```sh
pnpm install
pnpm dev
```

- 组件文档站：http://127.0.0.1:5173（直接打开 Copy Button）
- 文档：http://127.0.0.1:5173/docs
- 使用指南：http://127.0.0.1:5173/docs/installation

若端口已被占用，先停止之前启动的服务。

## 命令行安装

源码发布后，在已配置 shadcn/ui 的目标项目中执行（仓库地址为 churjan/jan-ui）：

```sh
pnpm dlx shadcn@latest add churjan/jan-ui/copy-button
```

根目录 registry.json 声明组件源码与依赖，CLI 直接读取 GitHub 默认分支，无需部署网站、生成公开 JSON 或配置 @janui 命名空间。如果以后更换仓库地址，将命令中的仓库段和 registry.json 的 homepage 一并更新。展示站从 homepage 自动生成命令。

尚未发布到 GitHub 前，这些远程安装命令不可用。

## 手动复制到其他项目

1. 从 GitHub 下载或克隆本仓库。
2. 将 `apps/www/components/jan-ui/` 中需要的组件复制到目标项目的 `src/components/jan-ui/`。
3. 将 `apps/www/lib/utils.ts` 复制到目标项目的 `src/lib/utils.ts`。
4. 安装依赖：`pnpm add lucide-react clsx tailwind-merge`。
5. 目标项目需要 React、Tailwind CSS v4，以及 shadcn 语义化主题变量。完整主题示例见 [使用指南源码](apps/www/content/docs/installation.mdx)。
6. 将 `@/*` 配置为目标项目的源码目录，或按自己的目录结构调整导入路径。

```tsx
import { CopyButton } from "@/components/jan-ui/copy-button"

export function Example() {
  return <CopyButton text="需要复制的内容" />
}
```

复制独立交互示例时，须把其中的 `@/components/jan-ui/` 导入改为目标项目的组件路径。组件仅需要 lucide-react 图标库和 cn 样式工具。

## 工程结构

采用 Next.js App Router、pnpm workspace、Turborepo、Fumadocs 与 MDX。

```text
apps/www/
  app/                    页面、布局和文档搜索 API
  components/jan-ui/      组件源码
  components/examples/    独立交互示例
  components/             展示站自身的组件
  content/docs/           MDX 文档
  lib/components.ts       组件展示目录
  lib/component-source.ts 服务端源码读取
  lib/utils.ts            共享样式工具
scripts/                  工作区工具
pnpm-workspace.yaml       工作区配置
pnpm-lock.yaml            依赖锁文件
 turbo.json               任务与缓存配置
```

## 常用命令

```sh
pnpm dev          # 开发
pnpm build        # 生产构建
pnpm start        # 启动生产构建
pnpm typecheck    # 类型检查
pnpm registry:check # 官方 CLI 本地校验并打包到忽略目录 .registry-check
```

## 添加组件

1. 在 `apps/www/components/jan-ui/` 添加组件。
2. 在 `apps/www/components/examples/<组件名>/` 添加交互示例，基础示例命名为 `demo.tsx`，其他示例按场景命名。
3. 在根目录 registry.json 添加组件元数据、源文件路径和依赖，展示目录自动读取此文件。
4. 在 `apps/www/components/component-preview.tsx` 注册示例。
5. 在 `apps/www/content/docs/components/` 添加 MDX 文档，并更新 meta.json。
6. 文档侧边栏从 meta.json 读取；首页直接进入 Copy Button 文档，不再维护重复的首页展示。
7. 执行 `pnpm registry:check`、`pnpm typecheck` 与 `pnpm build`。

组件文件名与目录中的 name 保持一致。

## 发布到 GitHub

将根目录 registry.json、所引用的源码及 pnpm-lock.yaml 一并提交到自己的 GitHub 仓库。缓存、node_modules、.next 与 .source 已在 .gitignore 中排除。

仓库发布和网站部署是两件独立的事。本项目可以只发布源码，使用者在自己的电脑运行展示站；无需部署网站，也无需申请目录收录。

发布后可运行 `pnpm dlx shadcn@latest registry validate churjan/jan-ui` 验证远程仓库（根据实际仓库名调整）。

官方说明：https://ui.shadcn.com/docs/registry/github

## Copy Button

复制文本到剪贴板，支持成功与失败反馈、图标模式和自定义名称。

配套示例、Props 和安装说明见 `/docs/components/copy-button`。运行 `pnpm test` 检查复制状态、失败重试、重复点击、禁用和卸载清理。
