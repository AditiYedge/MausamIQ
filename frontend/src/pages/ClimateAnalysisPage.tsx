import React, { useState, useEffect } from 'react';
import { CloudRain, BarChart3, Info, Calendar } from 'lucide-react';
import { District } from '../services/types';
import { fetchLocations, fetchClimateSummary, fetchClimateTrends } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import { ClimateCharts } from '../components/ClimateCharts';

export const ClimateAnalysisPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState('nashik');
  const [season, setSeason] = useState('kharif');
  const [year, setYear] = useState(2024);
  const [climateData, setClimateData] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDistricts() {
      try {
        const dList = await fetchLocations();
        setDistricts(dList);
      } catch (err) {
        console.error(err);
      }
    }
    loadDistricts();
  }, []);

  useEffect(() => {
    async function loadClimate() {
      if (!selectedDistrictId) return;
      setLoading(true);
      try {
        const [summary, trendList] = await Promise.all([
          fetchClimateSummary(selectedDistrictId, season, year),
          fetchClimateTrends(selectedDistrictId)
        ]);
        setClimateData(summary);
        setTrends(trendList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadClimate();
  }, [selectedDistrictId, season, year]);

  const selectedDistrict = districts.find(d => d.district_id === selectedDistrictId);
  const districtName = selectedDistrict
    ? (language === 'mr' ? selectedDistrict.name_mr : language === 'hi' ? selectedDistrict.name_hi : selectedDistrict.district_name)
    : selectedDistrictId;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Control Strip */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={20} color="var(--color-brand-primary)" />
            <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--color-brand-dark)' }}>
              Historical Climate & Meteorological Analytics
            </h2>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            IMD Pune 1981–2010 Climatological Baseline
          </span>
        </div>

        <div className="grid-3">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('label_district')}</label>
            <select
              className="form-select"
              value={selectedDistrictId}
              onChange={(e) => setSelectedDistrictId(e.target.value)}
            >
              {districts.map(d => (
                <option key={d.district_id} value={d.district_id}>
                  {language === 'mr' ? d.name_mr : language === 'hi' ? d.name_hi : d.district_name} ({d.agro_climatic_zone.split('/')[0].trim()})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('label_season')}</label>
            <select
              className="form-select"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
            >
              <option value="kharif">Kharif (June 1 – Oct 31)</option>
              <option value="rabi">Rabi (Oct 1 – Feb 28)</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('label_year')}</label>
            <select
              className="form-select"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              <option value={2024}>2024 (Latest Verified)</option>
              <option value={2023}>2023</option>
              <option value={2022}>2022</option>
            </select>
          </div>
        </div>
      </div>

      {climateData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <ClimateCharts
            indicators={{
              rainfall_observed_mm: climateData.rainfall_observed_mm,
              rainfall_normal_mm: climateData.rainfall_normal_mm,
              rainfall_anomaly_pct: climateData.rainfall_anomaly_pct,
              consecutive_dry_days: climateData.max_consecutive_dry_days,
              heavy_rainfall_days: climateData.heavy_rainfall_days_count,
              mean_tmax_c: climateData.mean_tmax_c,
              extreme_temp_days: climateData.extreme_temp_days || 0
            }}
            districtName={districtName}
            season={season}
            year={year}
            historicalTrends={trends}
          />

          {/* Meteorological Classification Explainer */}
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={17} color="var(--color-brand-primary)" />
              <span>India Meteorological Department (IMD) Departure Standards</span>
            </h3>
            <div className="grid-4" style={{ fontSize: '13px' }}>
              <div style={{ borderLeft: '3px solid #2B6CB0', paddingLeft: '10px' }}>
                <strong style={{ color: '#2B6CB0' }}>Excess (+20% or more)</strong>
                <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '12px' }}>
                  Risk of waterlogging in poorly drained heavy clay vertisols.
                </p>
              </div>

              <div style={{ borderLeft: '3px solid #1E5E3A', paddingLeft: '10px' }}>
                <strong style={{ color: '#1E5E3A' }}>Normal (-19% to +19%)</strong>
                <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '12px' }}>
                  Rainfall aligns with 30-year historical baseline normals.
                </p>
              </div>

              <div style={{ borderLeft: '3px solid #D69E2E', paddingLeft: '10px' }}>
                <strong style={{ color: '#D69E2E' }}>Deficient (-20% to -59%)</strong>
                <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '12px' }}>
                  Requires supplemental protective irrigation for rainfed field crops.
                </p>
              </div>

              <div style={{ borderLeft: '3px solid #E53E3E', paddingLeft: '10px' }}>
                <strong style={{ color: '#E53E3E' }}>Scanty (-60% or less)</strong>
                <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '12px' }}>
                  Severe drought trigger; mandates contingency drought cropping packages.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
