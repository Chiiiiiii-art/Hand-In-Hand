import React from 'react';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '../../config';
import { ShieldCheck, Question, ArrowRight, CaretDown } from '@phosphor-icons/react';

export const Rules: React.FC = () => {
  return (
    <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
          參與守則與常見問題
        </h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-lg)' }}>
          攜手基地重視安全、包容與自主權。請在報名前詳閱我們的社群規範。
        </p>
      </div>

      {/* 社群安全守則 (BR-01 ~ BR-09) */}
      <section className="card" aria-labelledby="rules-section-title">
        <h2 id="rules-section-title" style={{ fontSize: 'var(--text-xl)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-4)', color: 'var(--primary)' }}>
          <ShieldCheck size={28} weight="fill" />
          <span>社群安全與參與守則 (BR)</span>
        </h2>

        <ol style={{ paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', lineHeight: 1.8 }}>
          {APP_CONFIG.communityRules.map((rule, idx) => (
            <li key={idx} style={{ fontSize: 'var(--text-base)' }}>
              {rule}
            </li>
          ))}
        </ol>

        <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--ink-secondary)' }}>
          <strong>隱私保護承諾：</strong>
          報名時所填寫之聯絡方式僅供服務團隊進行一對一可及性確認及緊急聯絡使用。我們絕不會向其他成員公開您的私人通訊帳號或醫療狀況。
        </div>
      </section>

      {/* 常見問題 FAQ (FR-01) */}
      <section aria-labelledby="faq-section-title">
        <h2 id="faq-section-title" style={{ fontSize: 'var(--text-xl)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-4)' }}>
          <Question size={28} weight="fill" color="var(--primary)" />
          <span>常見問答 (FAQ)</span>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {APP_CONFIG.faqs.map((faq, idx) => (
            <details
              key={idx}
              className="card"
              style={{
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
            >
              <summary style={{ fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--ink-primary)', padding: '4px 0' }}>
                {faq.q}
              </summary>
              <p style={{ marginTop: 'var(--space-3)', color: 'var(--ink-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.8 }}>
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
        <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>
          <span>了解完畢，前往填寫報名表</span>
          <ArrowRight size={20} weight="bold" />
        </Link>
      </div>
    </div>
  );
};
