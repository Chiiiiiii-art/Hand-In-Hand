import React from 'react';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '../../config';
import { ShieldCheck, Question, ArrowRight } from '@phosphor-icons/react';

export const Rules: React.FC = () => {
  return (
    <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
          客廳約定與常見問答
        </h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-lg)' }}>
          攜手基地重視放鬆、互相尊重與每個人的自主節奏。加入小隊前，請先看看我們的客廳約定。
        </p>
      </div>

      {/* 客廳約定 */}
      <section className="card" aria-labelledby="rules-section-title">
        <h2 id="rules-section-title" style={{ fontSize: 'var(--text-xl)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-4)', color: 'var(--primary)' }}>
          <ShieldCheck size={28} weight="fill" />
          <span>五大客廳約定</span>
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
          預約時所填寫的聯絡方式僅供小幫手一對一調校連線手感與緊急聯繫使用。我們絕不向其他成員公開你的私人通訊帳號或個人隱私。
        </div>
      </section>

      {/* 常見問題 FAQ */}
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
          <span>了解完畢，立即預約小隊</span>
          <ArrowRight size={20} weight="bold" />
        </Link>
      </div>
    </div>
  );
};
