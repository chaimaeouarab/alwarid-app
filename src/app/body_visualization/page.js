'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import { MOCK_PATIENTS, formatDate } from '@/data/mockData';

const BodyViewer3D = dynamic(() => import('@/components/BodyViewer3D').then((m) => ({ default: m.BodyViewer3D })), { ssr: false });

const patient = MOCK_PATIENTS[0];

const severityClass = {
  critical: 'badge-critical',
  warning: 'badge-warning',
  caution: 'badge-neutral',
  stable: 'badge-success',
  info: 'badge-info',
};

export default function BodyVisualizationPage() {
  const [selectedRegion, setSelectedRegion] = useState('chest');
  const region = patient.bodyRegions[selectedRegion];

  return (
    <>
      <Header showMode modeName="consultation" patientName="Youssef El Amrani" patientId="PAT-2024-00147" />

      <div style={{ minHeight: 'calc(100vh - 80px)', background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>Cartographie Medicale 3D</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Visualisation anatomique interactive avec details cliniques par zone.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
            <div style={{ height: 640, border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <Suspense fallback={<div className="skeleton" style={{ width: '100%', height: '100%' }} />}>
                <BodyViewer3D onRegionSelect={setSelectedRegion} regions={patient.bodyRegions} selectedRegion={selectedRegion} />
              </Suspense>
            </div>

            <div className="card" style={{ height: 640, overflowY: 'auto' }}>
              <div className="card-header">
                <h2 style={{ fontSize: 15, fontWeight: 600 }}>{region?.label || 'Selectionnez une zone'}</h2>
              </div>

              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {region && (
                  <>
                    <div>
                      <span className={`badge ${severityClass[region.severity] || 'badge-neutral'}`}>
                        {region.severity}
                      </span>
                    </div>

                    {region.conditions?.length > 0 && (
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
                          Conditions
                        </div>
                        <ul style={{ listStyle: 'disc', paddingLeft: 18, fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                          {region.conditions.map((condition, index) => (
                            <li key={index}>{condition}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {region.medications?.length > 0 && (
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
                          Medicaments associes
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {region.medications.map((medication, index) => (
                            <span key={index} className="tag">{medication}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {region.scans?.length > 0 && (
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
                          Imagerie
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {region.scans.map((scan, index) => (
                            <div key={index} className="scan-thumb" style={{ cursor: 'default' }}>
                              <div className="scan-thumb-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect width="18" height="18" x="3" y="3" rx="2" />
                                  <circle cx="9" cy="9" r="2" />
                                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                </svg>
                              </div>
                              <div>
                                <div className="scan-title">{scan.type}</div>
                                <div className="scan-meta">{formatDate(scan.date)} - {scan.lab}</div>
                                <div className="scan-meta">{scan.result}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
