## 一、为什么需要OpenSpec？

### AI编程的"甜蜜陷阱"

AI编码助手确实强大。给它一个提示，几秒钟就能生成一大段代码。但这种"快"背后，藏着一个很大的问题：

**当需求只存在于聊天记录里时，AI会变得非常不可预测。**

比如你说"给我加个用户登录功能"，AI可能给你：

- 加了邮箱登录（但你想要手机号）
- 加了第三方登录（但你不需要）
- 改了数据库结构（但你只想改前端）

为什么会这样？因为你的"需求"太模糊了。AI只能靠猜，而它的猜测不一定准确。

### OpenSpec的核心理念

OpenSpec的想法很简单：**先把要做什么说清楚，再开始写代码。**

这个"说清楚"不是随便聊聊，而是：

1. **写成规范文档**：明确的需求、清晰的场景
2. **人和AI达成一致**：提案、审查、批准
3. **按规范实现**：AI照着批准的规范写代码
4. **留下完整记录**：所有决策都有据可查

用一个比喻：如果说让AI直接写代码是"边画边猜"，那OpenSpec就是"先画草图，确认无误，再正式施工"。

---

## 二、OpenSpec到底是什么？

### 一句话解释

OpenSpec是一个命令行工具，它帮你和AI助手建立一套**规范驱动的开发流程**，确保在写代码前，人和AI就"要做什么"达成一致。

### 核心特点

### 1. 轻量级设计

- 不需要API密钥
- 不需要复杂配置
- 几条命令就能用起来

### 2. 工具兼容性强

支持主流AI编码工具：

- [Claude Code](https://zhida.zhihu.com/search?content_id=264381476&content_type=Article&match_order=1&q=Claude+Code&zhida_source=entity)（我这次演示用的）
- Cursor
- [GitHub Copilot](https://zhida.zhihu.com/search?content_id=264381476&content_type=Article&match_order=1&q=GitHub+Copilot&zhida_source=entity)
- Windsurf
- 还有十几种其他工具

### 3. 为现有项目设计

OpenSpec不是只能用在新项目上。恰恰相反，它专门为**改进现有代码**（1→n）设计，而不仅仅是从零开始（0→1）。

### 4. 变更可追溯

每个功能变更都有：

- 提案文档（为什么做、做什么）
- 设计决策（技术选型的理由）
- 任务清单（分步骤实现）
- 规范文档（系统应该如何工作）

---

## 三、OpenSpec的工作流程

OpenSpec遵循一个四步工作流：

```text
┌────────────────────┐
│ 1. 起草提案        │  明确要做什么
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ 2. 审查对齐        │  人和AI达成一致
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ 3. 实现任务        │  AI按规范写代码
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ 4. 归档更新        │  更新项目文档
└────────────────────┘
```

### 第1步：起草提案

你告诉AI想要什么功能，AI会：

- 询问关键细节（避免误解）
- 生成完整提案文档
- 列出实现任务清单
- 创建规范增量（spec delta）

**重点**：这一步不写代码，只是把需求说清楚。

### 第2步：审查对齐

你和AI一起审查提案：

- 需求对不对？
- 技术方案合理吗？
- 有没有遗漏的地方？

可以反复修改，直到完全满意。

### 第3步：实现任务

提案批准后，AI开始写代码：

- 严格按照规范实现
- 逐个完成任务清单
- 标记完成进度

如果发现问题，可以随时修复，重新测试。

### 第4步：归档更新

功能完成并测试通过后：

- 变更归档保存
- 规范合并到项目文档
- 系统状态更新

整个项目有了清晰的"演进历史"。

---

## 四、实战演示：给[ForestFocus](https://zhida.zhihu.com/search?content_id=264381476&content_type=Article&match_order=1&q=ForestFocus&zhida_source=entity)添加自定义时长

下面用一个真实案例，带你完整走一遍OpenSpec流程。

### 背景介绍

我有一个名为ForestFocus的iOS应用，是一个专注计时器（类似番茄钟）。用户专注25分钟，就能种一棵树。

现在我想**添加自定义时长功能**：让用户可以选择15分钟、45分钟、90分钟等不同的专注时长，而不是固定的25分钟。

### 准备工作

### 1. 安装OpenSpec

```shell
# 检查Node.js版本（需要 >= 20.19.0）
node --version
# v22.20.0 ✓

# 全局安装OpenSpec
npm install -g @fission-ai/openspec@latest
```

### 2. 初始化项目

```shell
# 进入项目目录
cd /Users/charlesqin/Desktop/ForestFocus-main

# 初始化OpenSpec
openspec init
```

初始化时会问你：

- 用什么AI工具？我选了**Claude Code**
- 是否创建项目信息文件？选**是**

完成后，项目里会多一个`openspec`目录：

```shell
ForestFocus-main/
├── AGENTS.md              # AI助手指令
└── openspec/
    ├── AGENTS.md          # OpenSpec工作流说明
    ├── project.md         # 项目信息
    ├── specs/             # 规范文档（当前真实状态）
    └── changes/           # 变更提案（进行中的修改）
```

### 3. 填充项目信息

让Claude Code帮忙填充`project.md`：

```text
请阅读 openspec/project.md 并帮我填写有关我的项目、技术栈和约定的详细信息。
```

Claude Code会自动分析你的代码，填写：

- 项目用途
- 技术栈
- 代码规范
- 领域知识
- 约束条件

这一步很重要，它让AI充分理解你的项目背景。

---

### Step 1：创建变更提案

在Claude Code中输入斜杠命令：

```text
/openspec:proposal Custom Focus Duration
```

Claude Code不会立即写代码，而是先问我5个关键问题：

### 问题1：时长范围

- 最小时长是多少？
- 最大时长是多少？
- 步长是多少？（每次增加几分钟）

### 问题2：UI设计

- 在哪里选择时长？
- 放在设置页面还是主界面？

### 问题3：统计影响

- 如何计算"番茄钟个数"？
- 45分钟算几个番茄钟？

### 问题4：向后兼容

- 旧的会话记录怎么处理？
- 要迁移数据吗？

### 问题5：树木生长

- 不同时长下，树木生长的5个阶段如何计算？

这些问题看似简单，但**每一个都直接影响最终实现**。如果不提前明确，AI就只能自己猜，很可能猜错。

### 我的回答

```text
1. 时长范围：1-180分钟，快捷按钮15/25/45/60/90分钟
2. UI设计：主界面TimerView上，点击当前时长显示，弹出底部弹窗
3. 统计影响：显示实际时长 + 番茄钟等效（公式：向上取整duration/25）
4. 向后兼容：旧数据默认25分钟
5. 树木生长：按比例，公式 stageDuration = totalDuration / 5
```

### AI生成提案

我回答完问题后，Claude Code自动生成了完整提案：

**📄 [proposal.md](https://link.zhihu.com/?target=http%3A//proposal.md/)**

- 为什么做这个功能？
- 要改哪些地方？
- 影响哪些模块？
- 向后兼容吗？

**📄 [design.md](https://link.zhihu.com/?target=http%3A//design.md/)**

- 技术决策：为什么用[UserDefaults](https://zhida.zhihu.com/search?content_id=264381476&content_type=Article&match_order=1&q=UserDefaults&zhida_source=entity)而不是SwiftData？
- 数据存储：为什么用"分钟"而不是"秒"？
- 算法说明：树木阶段如何计算？

**📄 [tasks.md](https://link.zhihu.com/?target=http%3A//tasks.md/)**

- 44个具体任务
- 分成9个阶段
- 包含8个测试任务

**📁 specs/**

- 4个能力的规范增量

- timer-session（计时会话）
- tree-visualization（树木可视化）
- statistics-tracking（统计追踪）
- data-persistence（数据持久化）

---

### Step 2：审查和验证

生成提案后，我可以用命令行工具审查：

```text
# 查看活跃的变更
openspec list

# 验证提案格式
openspec validate add-custom-focus-duration

# 查看提案详情
openspec show add-custom-focus-duration
```

如果发现问题，继续和Claude Code对话：

```text
Can you add more acceptance criteria for the duration picker UI?
```

或者：

```text
The tree growth calculation seems complex. Can we simplify it?
```

可以反复迭代，直到提案完全符合预期。

---

### Step 3：实现功能

提案审查通过后，执行实现命令：

```text
/openspec:apply add-custom-focus-duration
```

Claude Code开始按照任务清单逐项实现：

### Phase 1：数据模型更新 ✅

```text
// FocusSession.swift
var durationMinutes: Int = 25  // 新增字段
var pomodoroEquivalent: Double {
    ceil(Double(durationMinutes) / 25.0)  // 番茄钟等效
}
```

### Phase 2：时长持久化 ✅

```text
// DurationPreference.swift
class DurationPreference {
    func save(_ duration: Int) { ... }
    func load() -> Int { ... }  // 默认25分钟
}
```

### Phase 3：计时服务增强 ✅

```text
// TimerService.swift
@Published var sessionDuration: Int

func calculateTreeStage(elapsed: Int, totalDuration: Int) -> Int {
    let stageDuration = totalDuration / 5  // 比例计算
    return min(elapsed / stageDuration, 4)
}
```

### Phase 4：时长选择器UI ✅

```text
// DurationPickerView.swift
- 快捷按钮：15、25、45、60、90分钟
- 滑块：1-180分钟范围
- 文本输入：精确值
- 无障碍支持
```

### Phase 5：界面集成 ✅

```text
// TimerView.swift
HStack {
    Image(systemName: "clock")
    Text("\\\\(duration) min")
}
.onTapGesture {
    showDurationPicker = true
}
```

### Phase 6：统计显示 ✅

```text
// StatsView.swift
Text("\\\\(hours)h \\\\(minutes)m (≈\\\\(pomodoroCount) 🍅)")
// 例如："2h 15m (≈5 🍅)"
```

整个过程中，Claude Code：

- 严格按照规范实现
- 标记完成的任务
- 保持代码风格一致

---

### 插曲：发现并修复Bug

实现完成后，我进行手动测试，发现了一个问题：

**Bug描述**：用户设置了1分钟时长后，下次想改时长，找不到设置入口了。原来的时长显示组件不够明显。

我立即告诉Claude Code：

```text
Bug: After setting duration to 1 min, I can't find where to change it again.
Make the duration badge always visible and tappable.
```

Claude Code理解问题后，增强了UI：

```text
// 修复后的设计
HStack {
    Image(systemName: "clock")
    Text("\\\\(duration)")
        .font(.system(size: 32, weight: .bold))  // 大字体
}
.padding()
.background(
    RoundedRectangle(cornerRadius: 12)
        .stroke(Color.green, lineWidth: 2)       // 绿色边框
        .shadow(radius: 4)                        // 阴影
)

Text("Tap to change")  // 提示文字
    .font(.caption)
```

修复后：

- 时长数字变成32pt粗体（高度可见）
- 加了绿色边框和阴影（吸引注意）
- 加了"Tap to change"提示（明确交互）

重新测试，问题完美解决！

**这就是OpenSpec的优势**：在归档前发现的问题，可以直接修复，不需要走复杂的流程。

---

### Step 4：归档变更

所有测试通过后，执行归档命令：

```text
openspec archive add-custom-focus-duration --yes
```

或在Claude Code中：

```text
/openspec:archive add-custom-focus-duration
```

归档过程中，OpenSpec会：

1. **移动变更到归档**

```text
openspec/changes/add-custom-focus-duration/
  → openspec/changes/archive/2025-10-17-add-custom-focus-duration/
```

1. **合并规范增量**

```text
specs/timer-session/spec.md 更新（新增3个需求，9个场景）
specs/tree-visualization/spec.md 更新（新增1个需求，2个场景）
specs/statistics-tracking/spec.md 更新（新增2个需求，5个场景）
specs/data-persistence/spec.md 更新（新增2个需求，4个场景）
```

1. **验证所有规范**

```text
✓ spec/data-persistence
✓ spec/statistics-tracking
✓ spec/timer-session
✓ spec/tree-visualization
```

归档完成后，Claude Code报告：

```text
✅ Archive Complete: Custom Focus Duration Feature

- 6 new files created
- 8 existing files updated
- 43/53 tasks completed (core functionality 100%)
- All validations passing
```

---

## 五、OpenSpec的核心优势

通过这个完整案例，我深刻体会到OpenSpec的价值：

### 1. 需求明确性

**传统方式**：

```text
我：给我加个自定义时长功能
AI：好的（开始写代码）
我：等等，我想要滑块和快捷按钮
AI：好的（改代码）
我：还要显示番茄钟个数
AI：好的（再改代码）
```

**OpenSpec方式**：

```text
我：/openspec:proposal 自定义时长
AI：请先回答5个问题...
我：（回答详细需求）
AI：生成完整提案
我：审查通过
AI：开始实现（一次到位）
```

在写代码前把需求说清楚，避免了反复修改的麻烦。

### 2. 技术决策有据可查

每个设计选择都有记录：

**为什么用UserDefaults而不是SwiftData？**

- 时长偏好是简单的Int值
- 不需要复杂查询
- UserDefaults更轻量快速

**为什么用"分钟"而不是"秒"？**

- 人类可读（25分钟 vs 1500秒）
- 与UI一致
- 减少转换错误

6个月后，当你想改进这个功能时，翻看`design.md`，立刻就能理解当时为什么这么做。

### 3. 可追溯的完整历史

每个功能变更都有完整记录：

- 什么时候加的？（2025-10-17）
- 为什么加？（用户需要灵活的时长）
- 怎么实现的？（44个任务的详细步骤）
- 遇到什么问题？（UI可见性bug及修复）

这对团队协作和知识传递非常有价值。

### 4. 迭代友好

在归档前发现的问题，可以直接修复：

- 不需要创建新提案
- 修复记录在同一变更中
- 保持变更的完整性

这种灵活性让OpenSpec非常适合实际开发。

### 5. 规范即文档

归档后，项目自动拥有了高质量的文档：

```text
openspec/specs/timer-session/spec.md

## Requirement: Custom Duration Selection
The system SHALL allow users to select focus duration
between 1 and 180 minutes.

### Scenario: Quick button selection
- WHEN user taps a quick-select button (15/25/45/60/90)
- THEN the duration is immediately set to that value
```

这些文档：

- 结构化（需求、场景）
- 可验证（通过测试确保实现符合规范）
- 易维护（与代码同步演进）

---

## 六、OpenSpec适合什么场景？

### 最适合的场景

### 1. 改进现有项目（1→n）

OpenSpec专门为此设计。它的双文件夹模型（`specs/`存放当前状态，`changes/`存放提议更新）让复杂的功能演进变得清晰可管理。

### 2. 需要高质量的场景

当你需要：

- 准确的实现
- 清晰的文档
- 可追溯的决策
- 团队协作

OpenSpec能提供规范化的支持。

### 3. 使用AI编码助手

OpenSpec的核心就是帮助AI更好地理解和实现你的需求。如果你已经在用Claude Code、Cursor等工具，OpenSpec会让你的效率翻倍。

### 不太适合的场景

### 1. 原型快速验证

如果你只是想快速试试一个想法，直接让AI写可能更快。OpenSpec的流程会增加一些前期时间（虽然能节省后期时间）。

### 2. 一次性脚本

写个几十行的小工具脚本，不需要OpenSpec的完整流程。

### 3. 需求极度不明确

如果你连大概想要什么都不知道，OpenSpec帮不了你。它的价值在于帮你**把想法变成清晰的规范**，而不是帮你**想出想法**。

---

## 七、上手OpenSpec：5分钟快速开始

### 1. 安装（1分钟）

```text
npm install -g @fission-ai/openspec@latest
```

### 2. 初始化项目（2分钟）

```text
cd your-project
openspec init
```

选择你使用的AI工具，完成配置。

### 3. 填充项目信息（2分钟）

让AI帮你填写`openspec/project.md`，描述项目背景。

### 4. 创建第一个提案（开始真正的工作）

在你的AI编码助手中：

```text
/openspec:proposal [你想要的功能]
```

或者用自然语言：

```text
I want to add [功能描述]. Please create an OpenSpec proposal.
```

就这么简单！

---

## 八、一些使用建议

### 建议1：第一个提案从小功能开始

不要一上来就用OpenSpec做大重构。先从一个小功能入手，熟悉流程：

- 添加一个新字段
- 修改一个UI组件
- 优化一个算法

走完一遍完整流程后，你会对OpenSpec有更深的理解。

### 建议2：认真对待澄清问题

当AI问你问题时，不要敷衍回答。这些问题往往直指需求的核心模糊点。花几分钟认真回答，能节省几小时的返工时间。

### 建议3：提案阶段多迭代

不要急着批准提案去写代码。仔细审查：

- 需求是否完整？
- 技术方案是否合理？
- 有没有遗漏的边界情况？

提案阶段改起来很容易，代码写了再改就麻烦了。

### 建议4：测试后再归档

归档意味着"这个变更完成了"。在归档前：

- 手动测试核心流程
- 确保没有明显bug
- 验证规范都已实现

归档后虽然还能修复问题（创建新提案），但保持变更的原子性会让历史记录更清晰。

### 建议5：规范文档是活的

OpenSpec生成的规范不是一次性的。每次添加功能，规范都会更新。几个月后，你会拥有一份完整、准确、与代码同步的项目文档。

---

## 九、OpenSpec vs 其他方案

### vs 直接让AI写代码

**直接方式**：

- 优点：快
- 缺点：容易偏离需求，反复修改，没有文档

**OpenSpec**：

- 优点：准确、可追溯、有文档
- 缺点：前期多花几分钟澄清需求

**结论**：小脚本用直接方式，正式项目用OpenSpec。

### vs 传统需求文档

**传统文档**（Word/Confluence）：

- 文档和代码分离
- 容易过时
- 难以和AI集成

**OpenSpec**：

- 文档和代码同步
- 自动更新
- AI原生支持

**结论**：OpenSpec是为AI时代设计的需求管理方式。

### vs spec-kit / Kiro

这些都是类似的规范驱动工具：

**spec-kit**：擅长新项目（0→1） **Kiro**：更新分散在多个文件 **OpenSpec**：专为改进现有项目设计（1→n），变更集中管理

---

## 十、总结

### OpenSpec解决的核心问题

AI编码助手很强大，但当需求模糊时，它会变得不可预测。OpenSpec通过引入**规范驱动的工作流**，确保在写代码前，人和AI就要做什么达成一致。

### 四步工作流

1. **起草提案** - 明确需求，AI询问关键问题
2. **审查对齐** - 人和AI共同审查，反复迭代
3. **实现任务** - AI按批准的规范写代码
4. **归档更新** - 变更归档，规范文档自动更新

### 核心价值

- **准确性**：需求明确后，AI实现准确
- **可追溯性**：每个决策都有记录
- **文档化**：规范自动生成，与代码同步
- **团队友好**：清晰的提案便于协作和交接

### 适用场景

- ✅ 改进现有项目
- ✅ 需要高质量实现
- ✅ 使用AI编码助手
- ✅ 团队协作开发
- ❌ 快速原型验证
- ❌ 一次性小脚本

### 我的体验

作为第一次使用OpenSpec的开发者，整个过程给我最大的感受是：**这才是AI时代应该有的开发方式**。

不是让AI瞎猜，而是：

1. 我说清楚想要什么
2. AI帮我把想法变成规范
3. 我们一起审查确认
4. AI精确实现
5. 留下完整文档

这个流程可能比直接写代码多花10分钟，但节省的是几小时的返工和几周后"这代码到底为什么这么写"的困惑。

### 开始使用

```text
npm install -g @fission-ai/openspec@latest
cd your-project
openspec init
```

然后在你的AI编码助手中：

```text
/openspec:proposal [你的第一个功能]
```

试一次，你会明白我在说什么。

---

## 写在最后

AI正在改变软件开发的方式，但它不是魔法。AI需要清晰的指令，需要结构化的输入，需要人类的引导。

OpenSpec不是让AI变得更智能，而是让**我们和AI的协作变得更高效**。

它像是人和AI之间的"协议"：我们用结构化的方式表达需求，AI用规范化的方式实现功能。双方都知道对方在说什么，这才是真正的协作。

如果你也在用AI编码助手，如果你也遇到过需求理解偏差的问题，如果你也希望代码有清晰的文档和历史，那么，试试OpenSpec吧。

也许它就是你一直在找的那个"更好的方式"。

---

**相关链接**

- GitHub: [https://github.com/Fission-AI/OpenSpec](https://link.zhihu.com/?target=https%3A//github.com/Fission-AI/OpenSpec)

---

### 🚀笔记

```text
# 0️⃣安装OpenSpec
npm install -g @fission-ai/openspec@latest

# 1️⃣新增自定义时长
/openspec:proposal Custom Focus Duration

# 2️⃣继续输入回答

1. Duration Options: Support 1-180 minutes range. Quick buttons: 15/25/45/60/90 min. 
   Users can also use slider or text input for any value in range.

2. Tree Growth Stages: Scale proportionally. Formula: stageDuration = totalDuration / 5
   Example: 45-min session → stages every 9 minutes

3. Duration Selection UI: Picker on main TimerView (tap current duration display).
   Opens as bottom sheet with quick buttons + slider + text input. NOT in Settings.

4. Duration Persistence: Remember last selected duration using UserDefaults.
   First launch defaults to 25 min, then uses user's last choice.

5. Statistics Impact: Show both actual time AND equivalent Pomodoro count.
   Formula: pomodoroCount = ceil(duration / 25.0)
   Example display: "45 min (≈2 🍅)"

Data Model:
- Store: duration (Int), startTime (Date), taskTag (String?)
- Calculate: pomodoroEquivalent (computed property)

Please proceed with creating the proposal based on these specifications.

# 3️⃣查看提议概要
## 1.直接查看文件
cat openspec/changes/add-custom-focus-duration/proposal.md
cat openspec/changes/add-custom-focus-duration/tasks.md

## 2.在编辑器中查看
code openspec/changes/add-custom-focus-duration/

## 3.使用交互式仪表板
openspec view

## 重点查看的文件：

proposal.md - 了解功能动机和整体设计
tasks.md - 确认任务分解是否合理
specs/ui-components/spec.md - UI交互细节
specs/timer-management/spec.md - 核心计时逻辑

# 4️⃣调整提议（如果需要）
## 1.直接在Claude Code中说：
请修改 add-custom-focus-duration 提议：
- 将最大时长从180分钟改为120分钟
- 添加一个新的快捷按钮：30分钟

## 2.手动编辑文件
nano openspec/changes/add-custom-focus-duration/proposal.md

# 5️⃣实施
/openspec:apply add-custom-focus-duration

## Claude Code会做什么：
读取 tasks.md 中的所有任务
按顺序逐个实施
自动标记完成的任务 ✓
生成或修改代码文件
遇到问题时询问你的决策

# 6️⃣测试

# 7️⃣测试全部通过（推荐路径）
## 步骤 1：归档 OpenSpec 变更 (1分钟)
### 方式A：使用 Claude Code（推荐）
### 在 Claude Code 中输入：
/openspec:archive add-custom-focus-duration

### 方式B：使用终端
### 在项目根目录执行
openspec archive add-custom-focus-duration --yes

# 8️⃣提交代码（2分钟）
git add .
git commit -m "feat: add custom focus duration feature

- Support 1-180 minute custom durations
- Quick-select buttons and slider input
- Proportional tree growth
- Persistent preferences
- Enhanced statistics with Pomodoro tracking

Implemented via OpenSpec workflow"

git push origin main
```