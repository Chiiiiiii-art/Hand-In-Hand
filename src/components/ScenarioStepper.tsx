import React from 'react';
import { useAppStore } from '../store';
import { SCENARIO_STEPS_META } from '../seed';
import { ScenarioStepNumber } from '../types';
import { SimBadge } from './SimBadge';
import {
  CaretLeft,
  CaretRight,
  ArrowsClockwise,
  Eye,
  CheckCircle,
  CaretDown,
  CaretUp
} from '@phosphor-icons/react';

export const ScenarioStepper: React.FC = () => {
  const { state, dispatch } = useAppStore();
  const currentStep = state.currentScenarioStep;
  const currentMeta = SCENARIO_STEPS_META.find(s => s.step === currentStep) || SCENARIO_STEPS_META[0];

  const handleStepChange = (targetStep: ScenarioStepNumber) => {
    dispatch({ type: 'SET_SCENARIO_STEP', step: targetStep });
    const targetMeta = SCENARIO_STEPS_META.find(s => s.step === targetStep);
    if (targetMeta) {
      dispatch({ type: 'SET_ROLE', role: targetMeta.targetRole });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      handleStepChange((currentStep - 1) as ScenarioStepNumber);
    }
  };

  const handleNext = () => {
    if (currentStep < 9) {
      handleStepChange((currentStep + 1) as ScenarioStepNumber);
    }
  };

  if (!state.isScenarioGuideOpen) {
    return (
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '6px 16px',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 'var(--text-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SimBadge label={`PRD 第 9 節情境步進中：第 ${currentStep}/9 步（${currentMeta.title}）`} />
            <span style={{ color: 'var(--ink-secondary)' }}>
              建議角色：{currentMeta.targetRole === 'host' ? '引導主持人' : '參與者'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => dispatch({ type: 'TOGGLE_SCENARIO_GUIDE' })}
            style={{
              padding: '4px 10px',
              fontSize: 'var(--text-xs)',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-full)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer',
            }}
          >
            <span>展開情境導覽浮條</span>
            <CaretDown size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside
      aria-label="PRD 第 9 節端到端情境走查導覽"
      style={{
        backgroundColor: '#FFFDF9',
        borderBottom: '2px solid var(--primary-border)',
        boxShadow: 'var(--shadow-sm)',
        padding: '10px 0',
      }}
    >
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span
              style={{
                backgroundColor: 'var(--primary)',
                color: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: 'var(--text-xs)',
              }}
            >
              PRD 第 9 節演示情境
            </span>
            <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-primary)' }}>
              從再次相聚到接續共同計畫
            </strong>
            <SimBadge label="模擬端到端閉環" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              style={{
                padding: '4px 8px',
                fontSize: 'var(--text-xs)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: currentStep === 1 ? 'var(--bg-sand-darker)' : 'var(--surface)',
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <CaretLeft size={14} />
              <span>上一步</span>
            </button>

            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, padding: '0 4px' }}>
              {currentStep} / 9
            </span>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentStep === 9}
              style={{
                padding: '4px 8px',
                fontSize: 'var(--text-xs)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: currentStep === 9 ? 'var(--bg-sand-darker)' : 'var(--surface)',
                cursor: currentStep === 9 ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>下一步</span>
              <CaretRight size={14} />
            </button>

            <button
              type="button"
              onClick={() => dispatch({ type: 'TOGGLE_SCENARIO_GUIDE' })}
              title="收合情境導覽浮條"
              style={{
                padding: '4px 8px',
                fontSize: 'var(--text-xs)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'transparent',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>收合</span>
              <CaretUp size={14} />
            </button>
          </div>
        </div>

        {/* 9 步進度膠囊條 */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            overflowX: 'auto',
            paddingBottom: 4,
          }}
        >
          {SCENARIO_STEPS_META.map((meta) => {
            const isActive = meta.step === currentStep;
            const isCompleted = meta.step < currentStep;
            return (
              <button
                key={meta.step}
                type="button"
                onClick={() => handleStepChange(meta.step)}
                style={{
                  flex: '0 0 auto',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-full)',
                  border: isActive ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: isActive ? 'var(--primary-subtle, #FFF8E7)' : isCompleted ? '#F0F9F0' : 'var(--surface)',
                  color: isActive ? 'var(--primary)' : 'var(--ink-secondary)',
                  fontSize: '11px',
                  fontWeight: isActive ? 700 : 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{meta.step}. {meta.title}</span>
                {isCompleted && <CheckCircle size={12} color="var(--primary)" weight="fill" />}
              </button>
            );
          })}
        </div>

        {/* 當前步驟核心操作指引卡 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 12px',
            fontSize: 'var(--text-xs)',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <div>
            <span style={{ color: 'var(--ink-secondary)' }}>當前步驟解說：</span>
            <strong style={{ color: 'var(--ink-primary)', marginLeft: 4 }}>
              {currentMeta.shortDesc}
            </strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="chip chip-info" style={{ fontSize: '10px' }}>
              建議操作：{currentMeta.actionHint}
            </span>
            {currentMeta.targetRole !== state.currentRole && (
              <button
                type="button"
                onClick={() => dispatch({ type: 'SET_ROLE', role: currentMeta.targetRole })}
                style={{
                  padding: '2px 8px',
                  fontSize: '11px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                切換至{currentMeta.targetRole === 'host' ? '主持人' : '參與者'}視角
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
