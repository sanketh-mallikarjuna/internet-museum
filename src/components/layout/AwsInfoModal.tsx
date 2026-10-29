import { AWS_ARCHITECTURE_CONFIG } from '../../services/cloudService';

interface AwsInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AwsInfoModal({ isOpen, onClose }: AwsInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="aws-modal-title">
      <div className="modal-container glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.5rem' }}>☁️</span>
            <div>
              <h3 id="aws-modal-title" style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>
                AWS Cloud Architecture &amp; Deployment Design
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Academic Project Specification • Cloud Computing
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', padding: '1.25rem 0' }}>
          <div className="aws-badge-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: 'var(--radius-full)', color: '#fbbf24', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            <span>⚡ Hosting Target: {AWS_ARCHITECTURE_CONFIG.currentHostingTarget}</span>
          </div>

          <section style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: 'var(--accent-cyan)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              1. Static Hosting Layer (Amazon S3 + CloudFront)
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              The Internet Museum is built as a pure client-side single-page application (SPA). It generates an immutable static bundle in <code>dist/</code> containing zero server-side runtime dependencies. It is completely ready for deployment to:
            </p>
            <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '1.25rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
              <li><strong>Amazon S3</strong>: Serves static assets with public read policy and website hosting configuration.</li>
              <li><strong>Amazon CloudFront</strong>: Edge CDN distribution providing low latency globally, SSL/TLS termination via AWS Certificate Manager (ACM), and gzip/Brotli compression.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: 'var(--accent-violet)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              2. Zero-Backend Trail Sharing &amp; Future Serverless Extension
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              The application uses URL hash/query compression to encode and deserialize custom trails peer-to-peer without requiring a central database. However, the codebase includes an extensible <code>MuseumCloudService</code> layer prepared for:
            </p>
            <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '1.25rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
              <li><strong>Amazon API Gateway + AWS Lambda</strong>: Serverless endpoints for global trail publishing and community discovery.</li>
              <li><strong>Amazon DynamoDB</strong>: Single-digit millisecond latency NoSQL persistence for global trail collections and visitor footprint telemetry.</li>
            </ul>
          </section>

          <section style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SIMULATED AWS EDGE METRICS</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>STATUS: HEALTHY</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div>Edge Latency: <strong style={{ color: 'var(--text-primary)' }}>{AWS_ARCHITECTURE_CONFIG.simulatedCloudStats.latencyMs} ms</strong></div>
              <div>Simulated Cloud Visitors: <strong style={{ color: 'var(--text-primary)' }}>{AWS_ARCHITECTURE_CONFIG.simulatedCloudStats.totalVisitorsLogged.toLocaleString()}</strong></div>
            </div>
          </section>
        </div>

        <div className="modal-footer" style={{ marginTop: '1rem', textAlign: 'right' }}>
          <button className="btn-primary" onClick={onClose} style={{ padding: '0.5rem 1.25rem' }}>
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
