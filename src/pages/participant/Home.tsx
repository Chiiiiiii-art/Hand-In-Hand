import React from 'react';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '../../config';
import { SimBadge } from '../../components/SimBadge';
import {
  UsersThree,
  Wheelchair,
  ShieldCheck,
  GameController,
  ArrowRight,
  ChatCircleText,
  Heart
} from '@phosphor-icons/react';

export const Home: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
      {/* Hero 區塊 */}
      <section
        aria-labelledby="hero-title"
        className="card"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-8)',
          alignItems: 'center',
          padding: 'var(--space-8)',
          backgroundColor: '#FFFFFF',
          borderColor: 'var(--primary-border)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="chip chip-info">年滿 18 歲同儕社群</span>
            <span className="chip chip-success">放鬆建造 / 無競爭壓力</span>
          </div>

          <h1
            id="hero-title"
            style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 700,
              color: 'var(--ink-primary)',
              lineHeight: 1.25,
            }}
          >
            在熟悉的螢幕前，<br />
            找到屬於你的<span style={{ color: 'var(--primary)' }}>固定同儕小組</span>。
          </h1>

          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ink-secondary)', lineHeight: 1.7 }}>
            攜手基地專為移動限制影響實體社交參與機會的成人設計。透過多人沙盒遊戲協作、專責主持人與無障礙操作確認，讓您穩定參與每週線上聚會，不必獨自面對陌生社群。
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>
              <span>立即了解並填寫報名</span>
              <ArrowRight size={20} weight="bold" />
            </Link>
            <Link to="/rules" className="btn-secondary" style={{ textDecoration: 'none' }}>
              <span>參與規則與常見問答</span>
            </Link>
          </div>
        </div>

        <div>
          <img
            src="/hero.jpg"
            alt="四位不同生理條件與使用輪椅的成人，在家中電腦前輕鬆連線協作建造遊戲"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--border)',
              boxShadow: 'var(--shadow-md)',
              objectFit: 'cover',
            }}
          />
        </div>
      </section>

      {/* 服務核心承諾 (四本柱) */}
      <section aria-labelledby="features-title">
        <h2
          id="features-title"
          style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 700,
            marginBottom: 'var(--space-6)',
            textAlign: 'center',
          }}
        >
          為什麼選擇攜手基地？
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'var(--space-6)',
          }}
        >
          <div className="card">
            <div style={{ color: 'var(--primary)', marginBottom: 12 }}>
              <Wheelchair size={36} weight="duotone" />
            </div>
            <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 8 }}>事前可及性確認</h3>
            <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)' }}>
              分組前先確認您習慣的滑鼠、鍵盤、手把或輔具控制方式。不要求提供任何醫療診斷或證明，只聚焦操作是否舒適。
            </p>
          </div>

          <div className="card">
            <div style={{ color: 'var(--primary)', marginBottom: 12 }}>
              <UsersThree size={36} weight="duotone" />
            </div>
            <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 8 }}>6-8 人固定同儕小組</h3>
            <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)' }}>
              每週固定成員聚會，避免陌生隨機配對帶來的社交焦慮。在 8 週的相處中建立真實互信與共同回憶。
            </p>
          </div>

          <div className="card">
            <div style={{ color: 'var(--primary)', marginBottom: 12 }}>
              <ChatCircleText size={36} weight="duotone" />
            </div>
            <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 8 }}>多元溝通無壓力</h3>
            <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)' }}>
              尊重文字或語音互動偏好。不強迫開麥克風、不強迫公開私人通訊方式，純文字打字享有完整遊戲主持支援。
            </p>
          </div>

          <div className="card">
            <div style={{ color: 'var(--accent)', marginBottom: 12 }}>
              <ShieldCheck size={36} weight="duotone" />
            </div>
            <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 8 }}>專責主持人與社群安全</h3>
            <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)' }}>
              每場皆由專業活動主持人協調，設有一對一問題回報機制。及時排解技術障礙，主動防範不當言行。
            </p>
          </div>
        </div>
      </section>

      {/* 參與者真實感受 (示範回饋) */}
      <section aria-labelledby="testimonials-title" className="card" style={{ backgroundColor: 'var(--bg-sand-darker)' }}>
        <h2 id="testimonials-title" style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Heart size={24} color="var(--accent)" weight="fill" />
          <span>參與者分享</span>
          <SimBadge label="示範回饋案例" />
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
          <blockquote className="card" style={{ fontStyle: 'italic', color: 'var(--ink-primary)' }}>
            “本來很擔心操作比別人慢會被嫌棄，但主持人和阿木都很有耐心地等我打字，第 2 週我們一起蓋出水上步道時，真的很有成就感！”
            <footer style={{ marginTop: 8, fontStyle: 'normal', fontWeight: 700, color: 'var(--primary)' }}>
              — 小禾（文字溝通為主，青鳥組成員）
            </footer>
          </blockquote>

          <blockquote className="card" style={{ fontStyle: 'italic', color: 'var(--ink-primary)' }}>
            “很久沒有跟固定的朋友每週約好了。在遊戲裡分工合作，不用出門也不用煩惱無障礙交通，很放鬆。”
            <footer style={{ marginTop: 8, fontStyle: 'normal', fontWeight: 700, color: 'var(--primary)' }}>
              — 阿木（手把操作，青鳥組成員）
            </footer>
          </blockquote>
        </div>
      </section>

      {/* 底部召喚行動 CTA */}
      <section style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-3)' }}>
          準備好開始一段全新的同儕旅程了嗎？
        </h2>
        <p style={{ color: 'var(--ink-secondary)', marginBottom: 'var(--space-6)', maxWidth: 600, margin: '0 auto var(--space-6) auto' }}>
          填寫簡單的報名需求，服務團隊將在一對一確認可及性後為您安排固定小組。
        </p>
        <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '14px 32px', fontSize: 'var(--text-lg)' }}>
          <span>開始填寫報名表</span>
          <ArrowRight size={22} weight="bold" />
        </Link>
      </section>
    </div>
  );
};
