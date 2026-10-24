# 鱼搭官网

鱼搭的产品官网，基于 [tanstack-start](https://github.com/yumengjh/tanstack-start) 启动模板（TanStack Start + React 19 + Nitro SSR + Tailwind CSS 4）。独立仓库，和鱼搭 Vue 用户端（smart-closet）互不依赖：自己的依赖、构建和产物，用户端的 Ant Design Vue 约定不适用于这里。

## 页面

| 中文 | 英文 | 内容 |
| --- | --- | --- |
| `/` | `/en` | 首屏贴纸视差、速度联动跑马灯、逐字点亮宣言、横向固定滚动的四步流程、推荐依据全屏展开、可拖拽贴纸画板、手机端视差、承诺列表 |
| `/features` | `/en/features` | 六个模块：左侧滚动、右侧固定画面随当前模块切换；技术卡片带 3D 倾斜 |
| `/pricing` | `/en/pricing` | 月付 / 年付切换（数字滚动）、三档方案、对比表、FAQ 手风琴。**方案与价格为暂定占位** |
| `/about` | `/en/about` | 品牌理念：Logo 随滚动与指针转动、价值词横向错位、“我们不做的事”逐条划掉 |

所有页面共享：首次加载开场动画（同一标签页再次加载只淡出）、页面切换幕布转场、Lenis 平滑滚动、桌面端跟随光标、磁吸按钮、颗粒质感叠层、深浅主题与中英文。

## 动效实现

| 位置 | 作用 |
| --- | --- |
| `src/lib/gsap.ts` | 注册 GSAP 插件（ScrollTrigger、SplitText、Draggable、Inertia），提供 `prefersReducedMotion()` |
| `src/lib/reveal-gate.ts` | 开场动画和转场幕布遮住页面时“关闸”，首屏入场动画等开闸后再播放 |
| `src/components/motion/SmoothScroll.tsx` | Lenis 驱动桌面滚轮，并与 ScrollTrigger 同步；触屏保留原生滚动 |
| `src/components/motion/PageTransition.tsx` | `TransitionLink`：先放下幕布，再切换路由，再收起 |
| `src/components/motion/hooks.ts` | `useEntrance`、`heroLines`，以及声明式滚动效果 `data-reveal` / `data-parallax` / `data-scrub-text` / `data-line-draw` |
| `src/components/Sticker.tsx` | 按 Logo 配色手绘的衣物贴纸 SVG（白色描边模拟产品里的“贴纸”） |

宽屏与窄屏分别用 `gsap.matchMedia()` 编排：横向固定滚动、全屏展开、功能页固定画面只在宽屏启用，手机上改为纵向排布。系统开启“减少动态效果”时跳过开场、转场与滚动动画，内容直接可见。

## 字体

全部自托管（国内访问不依赖 Google Fonts），按 `unicode-range` 切片，浏览器只下载页面用到的字。

| 用途 | 字体 | 包 |
| --- | --- | --- |
| 中文标题、正文大字 | 得意黑 Smiley Sans（OFL） | `@chinese-fonts/dyh` |
| 英文标题、数字、Logo 字标 | Unbounded | `@fontsource/unbounded` |
| 标签、编号等小字 | Space Mono | `@fontsource/space-mono` |
| 正文 | 苹方（Apple 设备自带），其他设备用思源黑体 Noto Sans SC | `@fontsource/noto-sans-sc` |

字体变量在 `src/styles/tokens/theme.css`，哪些元素用哪种字在 `src/styles.css` 末尾的 “Type system” 一节。得意黑只有一个字重，标题不要再加粗；Unbounded 的轮廓有重叠，描边空心字只用于中文，英文第二行改为品牌蓝实心。

## 文案与素材

- 页面文案在 `src/i18n/locales/zh.ts` 与 `en.ts`，按页面分组；页面通过 `useCopy()` 读取，导航等界面文字仍走 `t()`。
- 价格方案改 `pricing.plans` 与 `pricing.compare` 即可，两种语言需同步。
- 产品截图在 `public/shots/`，来自业务前端仓库 `docs/readme/`；手机截图由 `mobile.jpg` 裁成三张。
- OOTD 上身图在 `public/ootd/`（12 张，640×960 webp），人物均为 AI 生成的虚拟模特；图名和文案在 `home.looks`。
- 宣传片不放进仓库，地址用 `VITE_SITE_PROMO_VIDEO_URL` 指向 CDN，封面是 `public/shots/promo-poster.jpg`。

## 开发与构建

需要 Node.js 22+ 与 pnpm 11.10.0。

```bash
cd website
pnpm install --frozen-lockfile
cp .env.example .env   # 按需修改
pnpm dev               # http://localhost:3000
```

| 变量 | 说明 |
| --- | --- |
| `VITE_SITE_URL` | 官网正式域名（生产必须是 HTTPS），用于 canonical、sitemap 和 OG |
| `VITE_SITE_APP_URL` | “进入鱼搭”等按钮指向的用户端地址，默认 `https://yuda.yumg.cn/` |
| `VITE_SITE_NAME` 等 | 其余同模板，见 `.env.example` |

| 命令 | 用途 |
| --- | --- |
| `pnpm build` | 生成 sitemap、图标、OG 图后构建 SSR 产物到 `.output/` |
| `pnpm start` | 运行 `.output/server/index.mjs` |
| `pnpm check` / `pnpm typecheck` / `pnpm test` | Biome、TypeScript、Vitest |
| `pnpm test:e2e` | 构建后跑 Playwright；已有本机 Chromium 时可设 `PLAYWRIGHT_CHROMIUM_PATH` 指向它 |

新增公开页面时，同时添加中英文路由、`seo.*` 文案和 `scripts/generate-site-assets.mjs` 的 `routes`。
