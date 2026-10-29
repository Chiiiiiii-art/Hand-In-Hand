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
            <span className="chip chip-info">年滿 18 歲・在客廳輕鬆玩</span>
            <span className="chip chip-success">休閒協作・無勝負壓力</span>
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
            來這遇見你的隊友，<br />
            同時也是<span style={{ color: 'var(--primary)' }}>你的朋友</span>！
          </h1>

          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ink-secondary)', lineHeight: 1.7 }}>
            攜手基地是專為行動不便、長時間在家的成人打造的無障礙線上遊戲聚會所。透過每週固定小隊、專屬手感調校與溫柔小幫手守護，讓你放鬆享受每週連線時光，不用出門、也不必獨自面對陌生路人的社交焦慮。
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
            <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>
              <span>立即預約小隊</span>
              <ArrowRight size={20} weight="bold" />
            </Link>
            <Link to="/rules" className="btn-secondary" style={{ textDecoration: 'none' }}>
              <span>客廳約定與問答</span>
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

      {/* 聚會四大安心特色 (四本柱) */}
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
          為什麼在攜手基地玩，特別放鬆？
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
            <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 8 }}>專屬手感與設備調校</h3>
            <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)' }}>
              無論你習慣普通滑鼠、單手手把、軌跡球或特殊輔具，小幫手出發前都會一對一陪你測試連線，調到最順手才入隊；完全免附任何醫療證明。
            </p>
          </div>

          <div className="card">
            <div style={{ color: 'var(--primary)', marginBottom: 12 }}>
              <UsersThree size={36} weight="duotone" />
            </div>
            <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 8 }}>每週固定小隊</h3>
            <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)' }}>
              固定 6-8 位熟面孔每週相聚，不必每次上線重新破冰，徹底告別路人隨機配對的緊張感，在 8 週協作中自然培養好默契。
            </p>
          </div>

          <div className="card">
            <div style={{ color: 'var(--primary)', marginBottom: 12 }}>
              <ChatCircleText size={36} weight="duotone" />
            </div>
            <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 8 }}>文字打字與語音一樣重要</h3>
            <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)' }}>
              不想開麥克風完全沒關係！文字與語音享有同等尊重，小隊引導員與隊友全程看著文字頻道，絕不漏看你的任何一條訊息。
            </p>
          </div>

          <div className="card">
            <div style={{ color: 'var(--accent)', marginBottom: 12 }}>
              <ShieldCheck size={36} weight="duotone" />
            </div>
            <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 8 }}>客廳小幫手貼心守護</h3>
            <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)' }}>
              每場聚會皆有溫暖引導員陪伴；遇到任何按鍵卡關、斷線或不自在，隨時一對一私訊「安心求助」，全程保密為你排解。
            </p>
          </div>
        </div>
      </section>

      {/* 隊友真實回饋 (示範案例) */}
      <section aria-labelledby="testimonials-title" className="card" style={{ backgroundColor: 'var(--bg-sand-darker)' }}>
        <h2 id="testimonials-title" style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Heart size={24} color="var(--accent)" weight="fill" />
          <span>隊友悄悄話</span>
          <SimBadge label="示範聚會心得" />
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
          <blockquote className="card" style={{ fontStyle: 'italic', color: 'var(--ink-primary)' }}>
            “本來很擔心自己手部動作慢會拖累大家，但引導員和阿木都很有耐心地等我打字，第 2 週我們合力完成水上涼亭時，真的超有成就感！”
            <footer style={{ marginTop: 8, fontStyle: 'normal', fontWeight: 700, color: 'var(--primary)' }}>
              — 小禾（文字溝通為主，翠鳥組成員）
            </footer>
          </blockquote>

          <blockquote className="card" style={{ fontStyle: 'italic', color: 'var(--ink-primary)' }}>
            “很久沒有跟固定的朋友每週相約了。在遊戲裡分工合作，不用出門也不用煩惱無障礙交通，像真的回到朋友家客廳聊天一樣放鬆。”
            <footer style={{ marginTop: 8, fontStyle: 'normal', fontWeight: 700, color: 'var(--primary)' }}>
              — 阿木（手把操作，翠鳥組成員）
            </footer>
          </blockquote>
        </div>
      </section>

      {/* 底部召喚行動 CTA */}
      <section style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-3)' }}>
          準備好在螢幕前，遇見你的固定隊友了嗎？
        </h2>
        <p style={{ color: 'var(--ink-secondary)', marginBottom: 'var(--space-6)', maxWidth: 600, margin: '0 auto var(--space-6) auto' }}>
          花 3 分鐘告訴我們你的操作習慣與時間，小幫手會先與你線上調校手感，為你安排最合拍的小隊夥伴。
        </p>
        <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '14px 32px', fontSize: 'var(--text-lg)' }}>
          <span>立即預約小隊</span>
          <ArrowRight size={22} weight="bold" />
        </Link>
      </section>
    </div>
  );
};
