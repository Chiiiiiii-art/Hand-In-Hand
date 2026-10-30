import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { Application, ApplicationStatus } from '../../types';
import { StatusChip } from '../../components/StatusChip';
import { SimBadge } from '../../components/SimBadge';
import {
  CheckCircle,
  WarningCircle,
  Clock,
  User,
  ShieldCheck,
  X,
  Phone,
  ChatCircleText
} from '@phosphor-icons/react';

export const AdminApplications: React.FC = () => {
  const { state, dispatch } = useAppStore();

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredApps = state.applications.filter((a) => {
    if (filterStatus === 'all') return true;
    return a.status === filterStatus;
  });

  const handleUpdateStatus = (appId: string, newStatus: ApplicationStatus) => {
    dispatch({
      type: 'UPDATE_APPLICATION_STATUS',
      id: appId,
      status: newStatus,
    });
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp({ ...selectedApp, status: newStatus });
    }
  };

  const handleToggleCheck = (appId: string, field: keyof Application['accessibilityCheck']) => {
    if (!selectedApp) return;
    const currentVal = selectedApp.accessibilityCheck[field];
    const newChecks = { [field]: !currentVal };

    dispatch({
      type: 'UPDATE_ACCESSIBILITY_CHECK',
      id: appId,
      checks: newChecks,
    });

    setSelectedApp({
      ...selectedApp,
      accessibilityCheck: {
        ...selectedApp.accessibilityCheck,
        ...newChecks,
      }
    });
  };

  // BR-04 規則檢查：只有四項檢核全數通過，才能設為「可安排」
  const canSetReadyForGrouping = (app: Application) => {
    const { deviceConfirmed, controlsConfirmed, communicationConfirmed, supportNeedConfirmed } = app.accessibilityCheck;
    return deviceConfirmed && controlsConfirmed && communicationConfirmed && supportNeedConfirmed;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>
            申請審查與設備可及性確認
          </h1>
          <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)', marginTop: 4 }}>
            確認報名者之操作設備、溝通偏好，並於完成檢核後開放排入固定小組。
          </p>
        </div>

        {/* 狀態過濾下拉 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label htmlFor="filter-app" style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>狀態篩選：</label>
          <select
            id="filter-app"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ minHeight: 40, width: 'auto' }}
          >
            <option value="all">全部申請 ({state.applications.length})</option>
            <option value="待確認">待確認</option>
            <option value="需後續聯繫">需後續聯繫</option>
            <option value="可安排">可安排</option>
            <option value="已入組">已入組</option>
          </select>
        </div>
      </div>

      {/* 申請清單表格 */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>申請人</th>
              <th>年齡</th>
              <th>一對一聯絡資訊 (限後台)</th>
              <th>預計操作設備</th>
              <th>溝通偏好</th>
              <th>可及性確認進度</th>
              <th>當前狀態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map((app) => {
              const checkCount = Object.values(app.accessibilityCheck).filter(Boolean).length;

              return (
                <tr key={app.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{app.nickname}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>{app.submittedAt}</div>
                  </td>
                  <td>{app.age} 歲</td>
                  <td>
                    <code style={{ fontSize: 'var(--text-xs)', background: 'var(--bg-sand-darker)', padding: '2px 6px', borderRadius: 4 }}>
                      {app.contactInfo}
                    </code>
                    {app.shareContactConsent && (
                      <span style={{ display: 'block', fontSize: '10px', color: 'var(--status-success-ink)', marginTop: 2 }}>
                        ✓ 同意活動外自願分享
                      </span>
                    )}
                  </td>
                  <td>{app.inputMethod}</td>
                  <td>{app.communicationPreference}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)' }}>
                      <span>{checkCount}/4 項通過</span>
                      {checkCount === 4 ? (
                        <CheckCircle size={16} color="var(--primary)" weight="fill" />
                      ) : (
                        <Clock size={16} color="var(--ink-muted)" />
                      )}
                    </div>
                  </td>
                  <td>
                    <StatusChip status={app.status} />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => setSelectedApp(app)}
                      className="btn-secondary"
                      style={{ minHeight: 36, padding: '0 12px', fontSize: 'var(--text-sm)' }}
                    >
                      審核 / 確認
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 審核與可及性檢核彈窗 (Modal) */}
      {selectedApp && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-app-title"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(25, 39, 45, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: 16,
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: 640,
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: 'var(--surface)',
              border: '2px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 id="modal-app-title" style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>
                  申請審查：{selectedApp.nickname}
                </h2>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <StatusChip status={selectedApp.status} />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>ID: {selectedApp.id}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                aria-label="關閉彈窗"
                style={{ minHeight: 32, padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            {/* 詳細資料區塊 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 'var(--text-sm)', marginBottom: 16, backgroundColor: 'var(--bg-sand)', padding: 16, borderRadius: 'var(--radius-md)' }}>
              <div><strong>年齡：</strong>{selectedApp.age} 歲（已同意參與規則）</div>
              <div><strong>聯絡方式（限後台）：</strong>{selectedApp.contactInfo}</div>
              <div><strong>可參與時段：</strong>{selectedApp.availableSlots.join('、')}</div>
              <div><strong>預計操作方式：</strong>{selectedApp.inputMethod}</div>
              <div><strong>偏好溝通：</strong>{selectedApp.communicationPreference}</div>
              <div><strong>遊戲經驗：</strong>{selectedApp.gamingExperience}</div>
              <div><strong>特殊留意事項（非診斷）：</strong>{selectedApp.supportNeeds}</div>
            </div>

            {/* 可及性確認 4 項檢核清單 (FR-05 & BR-04) */}
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 8, color: 'var(--primary)' }}>
                事前可及性檢核清單 (FR-05)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedApp.accessibilityCheck.deviceConfirmed}
                    onChange={() => handleToggleCheck(selectedApp.id, 'deviceConfirmed')}
                    style={{ width: 18, height: 18 }}
                  />
                  <span>1. 設備環境已確認（電腦/筆電規格可順暢運行遊戲平台）</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedApp.accessibilityCheck.controlsConfirmed}
                    onChange={() => handleToggleCheck(selectedApp.id, 'controlsConfirmed')}
                    style={{ width: 18, height: 18 }}
                  />
                  <span>2. 控制與操作測試已確認（滑鼠/手把/輔具按鍵映射無衝突）</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedApp.accessibilityCheck.communicationConfirmed}
                    onChange={() => handleToggleCheck(selectedApp.id, 'communicationConfirmed')}
                    style={{ width: 18, height: 18 }}
                  />
                  <span>3. 溝通模式已確認（文字打字或語音通道已配對合適支援）</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedApp.accessibilityCheck.supportNeedConfirmed}
                    onChange={() => handleToggleCheck(selectedApp.id, 'supportNeedConfirmed')}
                    style={{ width: 18, height: 18 }}
                  />
                  <span>4. 活動中途支援需求已建檔（中場休息時間、主持人引導備忘）</span>
                </label>
              </div>
            </div>

            {/* 狀態切換按鈕區 (嚴格實施 BR-04 守則) */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginBottom: 8 }}>
                變更處理狀態：
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedApp.id, '待確認')}
                  className={selectedApp.status === '待確認' ? 'btn-primary' : 'btn-secondary'}
                  style={{ minHeight: 36, fontSize: 'var(--text-xs)' }}
                >
                  待確認
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedApp.id, '需後續聯繫')}
                  className={selectedApp.status === '需後續聯繫' ? 'btn-primary' : 'btn-secondary'}
                  style={{ minHeight: 36, fontSize: 'var(--text-xs)' }}
                >
                  需後續聯繫 (標記需調整)
                </button>

                <button
                  type="button"
                  disabled={!canSetReadyForGrouping(selectedApp)}
                  onClick={() => handleUpdateStatus(selectedApp.id, '可安排')}
                  className={selectedApp.status === '可安排' ? 'btn-primary' : 'btn-secondary'}
                  style={{ minHeight: 36, fontSize: 'var(--text-xs)' }}
                  title={!canSetReadyForGrouping(selectedApp) ? '依 BR-04 守則：4 項可及性檢核全數通過後方可設為可安排' : ''}
                >
                  可安排入組 (需檢核全數通過)
                </button>
              </div>

              {!canSetReadyForGrouping(selectedApp) && selectedApp.status !== '已入組' && (
                <p style={{ color: 'var(--status-warning-ink)', fontSize: 'var(--text-xs)', marginTop: 8 }}>
                  ⚠️ BR-04 規定：分組前應確認設備與操作方式，未全數確認者不能直接標示為可安排。
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
