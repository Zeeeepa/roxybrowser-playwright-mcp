# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

本仓库是 Microsoft Playwright 的 fork，通过 git subtree 维护在 `playwright/` 目录下。根包（`@roxybrowser/playwright-mcp`）是一个轻量 TypeScript 封装，将 `src/` 编译到 `dist/`。所有实质性的 MCP 服务器代码都在 `playwright/` 内部。

## 根包命令

```bash
pnpm build      # tsc — 编译 src/ → dist/
pnpm dev        # tsc --watch
```

要求 Node.js >=24.0.0，包管理器 pnpm 11.0.9。

## Playwright 子树（playwright/）

以下命令均在 `playwright/` 目录下执行。

### 构建

```bash
npm run build   # 完整构建
npm run watch   # 监听模式 — 开发时推荐使用，自动生成类型/通道/验证器
```

### 代码检查与类型检查

```bash
npm run flint   # 并行运行所有检查：eslint、tsc、doclint、check-deps、generate_channels、generate_types 等
```

提交前必须运行 `flint`，不要单独使用 `tsc --noEmit` 或单个 lint 命令。

### 测试命令

| 命令 | 范围 |
|------|------|
| `npm run ctest-mcp <filter>` | 仅 Chromium 的 MCP 测试 — 开发时使用 |
| `npm run test-mcp <filter> -- --project=<chromium\|firefox\|webkit>` | 全浏览器 MCP 测试 |
| `npm run ctest <filter>` | 仅 Chromium 的库测试 |
| `npm run ttest <filter>` | 测试运行器测试（`tests/playwright-test/`） |

过滤示例：
```bash
npm run ctest-mcp snapshot                # 按文件名片段
npm run ctest-mcp -- --grep "title"       # 按测试名称
npm run ctest tests/page/locator-click.spec.ts:12
```

不要使用 `test --debug`。

## 架构

### 关键目录

```
playwright/packages/playwright-core/src/tools/
├── backend/          # 所有 MCP 工具实现（defineTool/defineTabTool）
│   ├── tool.ts       # Tool/TabTool 类型，defineTool()，defineTabTool()
│   ├── tools.ts      # 工具注册表（browserTools 数组，filteredTools）
│   ├── browserBackend.ts  # 路由工具调用，管理浏览器上下文生命周期
│   ├── context.ts    # 浏览器上下文状态
│   ├── tab.ts        # Tab/Page 封装
│   └── response.ts   # 响应累加器，parseResponse()
├── mcp/              # MCP 服务器入口、配置解析、浏览器工厂
│   ├── config.d.ts   # Config 和 ToolCapability 类型
│   ├── config.ts     # FullConfig、CLIOptions、环境变量映射、配置合并顺序
│   ├── program.ts    # MCP 服务器的 CLI 参数
│   └── browserFactory.ts
├── cli-client/       # CLI 客户端（解析参数，通过 socket 发送给 daemon）
├── cli-daemon/       # Daemon（通过 declareCommand() 将 CLI 参数映射到 MCP 工具调用）
│   ├── command.ts    # Category 类型，declareCommand()，parseCommand()
│   └── commands.ts   # 所有 CLI 命令声明
└── utils/mcp/        # MCP SDK 封装（server.ts、tool.ts、http.ts）

playwright/tests/mcp/
├── fixtures.ts       # client、startClient、server 测试夹具
├── cli-fixtures.ts   # cli() 辅助夹具
└── *.spec.ts         # MCP 和 CLI 测试
```

### 执行流程

**MCP 模式：** LLM → MCP 协议 → `Server.callTool(name, args)` → zod 验证 → `Tool.handle(context|tab, params, response)` → `response.serialize()` → LLM

**CLI 模式：** 用户 → `playwright-cli cmd arg --opt` → 客户端用 minimist 解析 → daemon socket → `parseCommand()` 映射到 MCP 工具参数 → `backend.callTool()` → stdout

### 添加 MCP 工具

1. 在 `packages/playwright-core/src/tools/backend/<tool>.ts` 中使用 `defineTabTool`（大多数工具）或 `defineTool`（需要完整 context）创建工具文件。
2. 在 `tools.ts` 的 `browserTools` 数组中注册。
3. 如需新能力，在 `config.d.ts` 中添加 `ToolCapability`。`core*` 能力始终启用，其他需通过 `--caps` 或配置开启。
4. 在 `tests/mcp/<category>.spec.ts` 中使用 `client.callTool()` 和 `toHaveResponse()` 编写测试。

### 添加 CLI 命令

1. 先实现对应的 MCP 工具。
2. 在 `cli-daemon/commands.ts` 中用 `declareCommand()` 声明命令，映射 CLI 参数/选项 → `toolName`/`toolParams`。
3. 更新 `packages/playwright/src/skill/SKILL.md`。
4. 在 `tests/mcp/cli-<category>.spec.ts` 中使用 `cli()` 夹具编写测试。

### 添加配置项

按顺序更新：`config.d.ts`（类型）→ `config.ts`（FullConfig、CLIOptions、`configFromCLIOptions`、`configFromEnv`）→ `program.ts`（CLI 参数）。

配置解析优先级：`defaultConfig` → 配置文件 → 环境变量 → CLI 参数（后者优先）。

## DEPS 系统

通过仓库中 52+ 个 `DEPS.list` 文件强制执行导入边界。客户端代码不能导入服务端代码，反之亦然，通信只能通过协议层进行。创建或移动文件时，需更新相关 `DEPS.list`。运行 `npm run flint` 检查。

## 编码规范

对于导出类：
- `private _method()` — 仅在类内部使用
- `_method()`（无 `private`）— 仅在同一文件内使用
- `method()` — 可跨文件使用

## 提交规范

语义化提交信息：`label(scope): description`  
标签：`fix`、`feat`、`chore`、`docs`、`test`、`devops`

不要修改（amend）已有提交，后续修改始终创建新提交。不要添加 Co-Authored-By 或 "Generated with" 行。未收到明确指令前不要执行 `git push`。

## 开发技能

以下技能提供详细开发指南：
- `/playwright-dev` — 添加 API、MCP 工具、CLI 命令、依赖打包
- `/playwright-devops` — CI 失败分析、工作流调试、发布操作
