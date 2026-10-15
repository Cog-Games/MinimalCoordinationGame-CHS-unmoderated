# 数据存储方案（schema 3.0.0）

## 实施目标

1. 完整 JSON 为权威原始数据；Excel 为兼容分析副本，保留旧字段并增加说明字段。
2. 每次开始/执行动作/结束回合及回答理解题后，写入浏览器 IndexedDB。每 15 秒补充会话快照；离开/失焦也尝试记录。浏览器本地保留最新完整会话，服务器保留收到的不可变 revision。
3. 本地写入与网络解耦。收到匹配 sessionId/revision 的服务器 JSON 确认才标记已保存；超时、断网、HTTP 错误均保留待传记录，15 秒及上线时重试。刷新创建新会话，自动补传旧会话，不恢复旧局面。强制关机仍可能损失尚未完成本地事务的最后一次输入。
4. 服务器文件放在 `RESEARCH_DATA_DIR` 指定目录（默认 repo 下 research-data），不通过静态路由提供下载，不写入 Git。每个会话随机写入密钥；原子文件替换、fsync 后返回确认；相同 revision 重试去重，冲突拒绝。
5. sessionId、trialId、dyadId、schema/build/commit、实际地图、奖励、布局、逐步事件、DP 决策、最终坐标与终止原因可关联。旧 RT 保留并标注 cumulative execution elapsed，新增输入事件时间，不将其解释为完整认知反应时。不同设备时钟不直接比较。
6. 原始数据含当前未完成回合，区别 ended/active、success、terminationReason。练习与 main 分开；合作概览只算 main 且确有双人。
7. 页面显示保存状态及“Download backup”；备份含此浏览器此来源所有保留会话（可能含个人信息），不包含写入密钥。共享设备使用完后研究人员应导出、确认并通过浏览器站点数据设置清理。

## 数据结构与分析

- sessions：sessionId/participantId/dyadId、mode/flow、版本、配置、保存检查点、理解题、问卷、布局。
- allTrialsData：已结束回合，trialId、trialPhase、mapDesign、实际奖励、结果和终止原因。
- activeTrial：未结束回合及当前状态；不得当作完整试次分析。
- 每回合 events：事件序号、turnId、时间戳、相对时间、输入/决策/执行与位置。
- dpDecisions：原有 DP 参数/动作概率；与 trialId/step 对接。
- 理解题保存每次回答与相对题目展示时间。Excel 增加理解题与完整会话元数据，JSON 不依赖第三方 XLSX 脚本。

## 运维与范围

本机保存和 Google Drive 旧接口相互独立。当前 LAN 仍关闭旧 Drive 上传；新本地服务器保存开启。Drive 的 opaque 响应只能称“已尝试上传”，不能确认成功。

此实现用于受信任同 Wi-Fi 试玩/研究环境，不提供公共互联网身份验证、限流、加密远程备份。电脑必须保持运行；服务器目录应定期复制到机构批准的受控存储，生产主机必须配置持久磁盘。浏览器副本不能替代研究归档。保留期限与个人信息访问权限由研究方案决定，代码不自动删除记录。两种玩法流程仍不同，不能无条件合并作因果比较。

## 验证要求

覆盖离线缓存、刷新恢复、重复/乱序 revision、保存失败、无效确认、写入密钥、超时和 Set 序列化、练习排除、理解题/布局导出；运行现有 DP、合法动作和 LAN 回归测试及构建。运行服务用合成数据验证真正落盘，测试数据放在专用临时目录。

## 使用方法

两个游戏入口使用相同的本机存储服务。启动：

```bash
RESEARCH_DATA_DIR=/absolute/private/data PORT=3101 npm start
```

不设置目录时保存到项目的 `research-data/<sessionId>/<revision>.json`。目录不对 Wi-Fi 浏览器提供读取接口。保留完整版本历史会占用空间，应监控磁盘和定期备份。页面关闭前确认左下角显示 `Saved to study computer`；显示待上传时可先下载备份。

研究人员导出最新快照为五张 JSONL 表（无需数据库或 Excel）：

```bash
node scripts/export-research-data.mjs research-data research-export-2026-09-29
```

输出目录必须尚不存在，避免覆盖已有分析结果。表名：sessions、trials、events、agent_decisions、responses。未结束回合保留 status=active，分析主回合使用 trialPhase=main、status=ended，并按预先规定筛选 terminationReason。LAN 两端用 dyadId+experimentType+trialIndex 配对，同一对玩家不能算作两个独立样本。JSONL 可由 pandas.read_json(path, lines=True) 读取。

代码版本包括 commit、dirty 标志、构建时间与实际源文件 SHA-256，能区分未提交的本地构建。

## 本次实施与验证（2026-09-29）

已完成上述存储、记录补齐、Excel 分表及 JSONL 分析导出。3101/3102 已从主工作目录启动新服务，共用主目录 research-data，未打开旧 Google Drive 上传。旧页面需刷新，之前未保存的数据不会因升级被自动找回。配置默认保留已有奖励规则；单人练习记录实际旧奖励参数，分析时按 trialKind/trialPhase 排除，未暗中改变实验条件。

通过 test:storage、test:stag-dp、test:stag-legal-turns、test:lan 和生产构建。存储测试包括真实临时 HTTP 服务与磁盘文件、错误密钥/冲突/重复和乱序 revision、磁盘失败、无效 ACK、离线/重新加载重试、并发保存、JSONL 最新版本选择、Set、超时/最大步数与最后一步到达目标、理解题/布局 Excel 导出、练习排除。

真实浏览器中两位玩家完成 8 步合作回合，各得 5 分，两端文件共享 dyadId。另将隔离服务器关停，下载本地备份并关闭页面；恢复服务器后新页面成功补传旧会话 revision 3，离线前只落盘到 revision 2。所有实测数据在 /tmp/cake-storage-browser-test，没有进入正式 research-data。手机等另一台物理设备本次未实测。

验证摘要：output/data-storage-implementation/validation.json。截图：output/data-storage-implementation/saved-confirmation.png。
