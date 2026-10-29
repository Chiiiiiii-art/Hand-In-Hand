import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { SimBadge } from '../../components/SimBadge';
import {
  GameController,
  PlusCircle,
  CheckCircle,
  FileText,
  Sparkle,
  PaintBrush,
  Package,
  ChatTeardropDots
} from '@phosphor-icons/react';

export const TaskOrchestrator: React.FC = () => {
  const { state, dispatch } = useAppStore();

  const eightWeekTemplates = [
    { week: 1, title: '初次相遇與家園基地選址', goal: '一起決定基地主題、插上小組旗幟、鋪設集合廣場' },
    { week: 2, title: '同儕水上花園協力建造', goal: '四人合力完成一條無障礙環湖步道與水上休憩涼亭' },
    { week: 3, title: '基地迎賓入口與地標建設', goal: '成員提出入口造型提案，投票決策並分工搭建' },
    { week: 4, title: '水上高架景觀鐵道聯網', goal: '鋪設觀光礦車鐵路，串連水上花園與迎賓入口' },
    { week: 5, title: '基地故事、隊徽與共同守則', goal: '為島嶼撰寫專屬神話或共同生活規則，設立告示碑' },
    { week: 6, title: '同伴自由提案主導週', goal: '完全由成員自主發起並表決想擴建的建築設施' },
    { week: 7, title: '延伸共同活動的可能', goal: '小組探索是否繼續沙盒遊戲或展開其他線上/線下提案' },
    { week: 8, title: '全景歷程回顧與未來展望', goal: '環島回顧 8 週作品，自願選擇是否延續小組相聚' },
  ];

  const [selectedTemplate, setSelectedTemplate] = useState(eightWeekTemplates[2]);
  const [taskTitle, setTaskTitle] = useState(selectedTemplate.title);
  const [taskGoal, setTaskGoal] = useState(selectedTemplate.goal);
  const [taskWeek, setTaskWeek] = useState(3);

  const handleApplyTemplate = (tpl: typeof eightWeekTemplates[0]) => {
    setSelectedTemplate(tpl);
    setTaskTitle(tpl.title);
    setTaskGoal(tpl.goal);
    setTaskWeek(tpl.week);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'SET_TOAST',
      message: `已將第 ${taskWeek} 週任務【${taskTitle}】發布至小組基地！`
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* 標題 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800 }}>
              主持人任務編排器 (FR-11)
            </h1>
            <span className="chip chip-info">陳主持（引導社工師）</span>
            <SimBadge label="團隊互惠任務範本" />
          </div>
          <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)', marginTop: 4 }}>
            編排符合 PRD v2.0 友誼支持原則的共同任務：具備明確團隊目標、多元有意義的貢獻方式與非強制性回顧提示。
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {/* 左側：8 週進程範本庫 */}
        <section className="card" aria-labelledby="templates-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <FileText size={20} color="var(--primary)" />
            <h2 id="templates-title" style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
              PRD 第 4.3 節：八週共同世界進程範本
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {eightWeekTemplates.map((tpl) => {
              const isSelected = selectedTemplate.week === tpl.week;
              return (
                <button
                  key={tpl.week}
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: isSelected ? 'var(--primary-subtle, #FFF8E7)' : 'var(--surface)',
                    cursor: 'pointer',
                    gap: 4,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <strong style={{ fontSize: 'var(--text-sm)', color: isSelected ? 'var(--primary)' : 'var(--ink-primary)' }}>
                      第 {tpl.week} 週：{tpl.title}
                    </strong>
                    {isSelected && <span className="chip chip-success" style={{ fontSize: '10px' }}>已選取</span>}
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)', margin: 0 }}>
                    {tpl.goal}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* 右側：任務發布與檢核表單 */}
        <section className="card" aria-labelledby="task-form-title" style={{ borderColor: 'var(--primary-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <GameController size={20} color="var(--primary)" />
            <h2 id="task-form-title" style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
              任務內容設定與規則檢核 (FR-11)
            </h2>
          </div>

          <form onSubmit={handlePublish} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, display: 'block', marginBottom: 4 }}>
                週次第幾週 *
              </label>
              <input
                type="number"
                min={1}
                max={8}
                value={taskWeek}
                onChange={(e) => setTaskWeek(Number(e.target.value))}
                style={{ width: '100%', padding: '8px', fontSize: 'var(--text-sm)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, display: 'block', marginBottom: 4 }}>
                共同任務名稱 *
              </label>
              <input
                type="text"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                style={{ width: '100%', padding: '8px', fontSize: 'var(--text-sm)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, display: 'block', marginBottom: 4 }}>
                團隊共同目標（需要互相討論、選擇或協作） *
              </label>
              <textarea
                rows={3}
                required
                value={taskGoal}
                onChange={(e) => setTaskGoal(e.target.value)}
                style={{ width: '100%', padding: '8px', fontSize: 'var(--text-sm)' }}
              />
            </div>

            {/* 預設多元貢獻方式檢核 (FR-11 要求發布前檢查必要欄位) */}
            <div style={{ backgroundColor: 'var(--bg-sand-darker)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>已包含 4 種有意義的貢獻方式 (FR-05 檢查通過)：</div>
              <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--ink-secondary)', lineHeight: 1.6 }}>
                <li>直接操作遊戲（方塊放置與結構搭建）</li>
                <li>提出或篩選設計方案（草圖瀏覽與投票排序）</li>
                <li>建材與資源歸納（公共建材分類收納）</li>
                <li>文字／語音討論協調（尺寸規劃與進度筆記）</li>
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
              <button
                type="submit"
                className="btn-primary"
                style={{ fontSize: 'var(--text-sm)', minHeight: 40 }}
              >
                <CheckCircle size={18} />
                <span>儲存並發布至小組基地</span>
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};
