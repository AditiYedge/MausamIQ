import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { District } from '../services/types';
import { useLanguage } from '../i18n/LanguageContext';
import { MapPin, Table as TableIcon, Map as MapIcon } from 'lucide-react';

interface DistrictMapProps {
  districts: District[];
  selectedDistrictId: string;
  onSelectDistrict: (districtId: string) => void;
}

export const DistrictMap: React.FC<DistrictMapProps> = ({
  districts,
  selectedDistrictId,
  onSelectDistrict
}) => {
  const { language } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');

  const getDistrictName = (d: District) => {
    if (language === 'mr') return d.name_mr || d.district_name;
    if (language === 'hi') return d.name_hi || d.district_name;
    return d.district_name;
  };

  const getMarkerColor = (anom?: number) => {
    if (anom === undefined || anom === null) return '#52634F';
    if (anom >= 20) return '#2B6CB0'; // Excess (Blue)
    if (anom >= -19) return '#1E5E3A'; // Normal (Green)
    if (anom >= -59) return '#D69E2E'; // Deficient (Amber)
    return '#E53E3E'; // Scanty (Red)
  };

  useEffect(() => {
    if (viewMode !== 'map' || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet Map centered on Maharashtra
      const map = L.map(mapContainerRef.current, {
        center: [19.25, 75.8],
        zoom: 7,
        minZoom: 6,
        maxZoom: 10,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add district circle markers
    districts.forEach(d => {
      const isSelected = d.district_id === selectedDistrictId;
      const markerColor = getMarkerColor(d.rainfall_anomaly_pct);

      const marker = L.circleMarker([d.latitude, d.longitude], {
        radius: isSelected ? 11 : 7,
        fillColor: markerColor,
        color: isSelected ? '#123321' : '#FFFFFF',
        weight: isSelected ? 3 : 1.5,
        opacity: 1,
        fillOpacity: 0.85
      }).addTo(map);

      const name = getDistrictName(d);
      const anomText = d.rainfall_anomaly_pct !== undefined 
        ? `${d.rainfall_anomaly_pct > 0 ? '+' : ''}${d.rainfall_anomaly_pct}%` 
        : 'Normal';

      marker.bindTooltip(`
        <div style="font-family: inherit; font-size: 13px; line-height: 1.4;">
          <strong>${name}</strong><br/>
          <small style="color: #4A5568;">${d.agro_climatic_zone}</small><br/>
          <span>Departure: <strong>${anomText}</strong></span>
        </div>
      `, { direction: 'top' });

      marker.on('click', () => {
        onSelectDistrict(d.district_id);
      });

      markersRef.current.push(marker);
    });

  }, [districts, selectedDistrictId, viewMode, language]);

  // Handle map resizing smoothly across devices and orientation shifts
  useEffect(() => {
    if (viewMode === 'map' && mapInstanceRef.current) {
      const timer = setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [viewMode]);

  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="card" style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={18} color="var(--color-brand-primary)" />
          <h3 style={{ margin: 0, fontSize: '16px' }}>Maharashtra Agro-Climatic Map</h3>
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', background: 'var(--color-bg-subtle)', borderRadius: '6px', padding: '2px' }}>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              background: viewMode === 'map' ? '#FFFFFF' : 'transparent',
              color: viewMode === 'map' ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
              boxShadow: viewMode === 'map' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <MapIcon size={13} />
            <span>Map</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              background: viewMode === 'table' ? '#FFFFFF' : 'transparent',
              color: viewMode === 'table' ? 'var(--color-brand-primary)' : 'var(--color-text-muted)',
              boxShadow: viewMode === 'table' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <TableIcon size={13} />
            <span>List</span>
          </button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div>
          <div
            ref={mapContainerRef}
            className="leaflet-map-wrapper"
          />
          {/* Map Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '10px', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2B6CB0' }}></span>
              <span>Excess (≥+20%)</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#1E5E3A' }}></span>
              <span>Normal (-19% to +19%)</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#D69E2E' }}></span>
              <span>Deficient (-20% to -59%)</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#E53E3E' }}></span>
              <span>Scanty (≤-60%)</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="table-responsive" style={{ maxHeight: '360px' }}>
          <table style={{ width: '100%', minWidth: '400px', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                <th style={{ padding: '8px' }}>District</th>
                <th style={{ padding: '8px' }}>Agro-Climatic Zone</th>
                <th style={{ padding: '8px' }}>Normal (mm)</th>
                <th style={{ padding: '8px' }}>Departure</th>
              </tr>
            </thead>
            <tbody>
              {districts.map(d => {
                const isSelected = d.district_id === selectedDistrictId;
                return (
                  <tr
                    key={d.district_id}
                    onClick={() => onSelectDistrict(d.district_id)}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'var(--color-brand-light)' : 'transparent',
                      fontWeight: isSelected ? 600 : 400
                    }}
                  >
                    <td style={{ padding: '8px' }}>{getDistrictName(d)}</td>
                    <td style={{ padding: '8px', color: 'var(--color-text-secondary)', fontSize: '12px' }}>{d.agro_climatic_zone}</td>
                    <td style={{ padding: '8px' }}>{d.normal_kharif_rf_mm} mm</td>
                    <td style={{ padding: '8px', color: getMarkerColor(d.rainfall_anomaly_pct), fontWeight: 600 }}>
                      {d.rainfall_anomaly_pct !== undefined ? `${d.rainfall_anomaly_pct > 0 ? '+' : ''}${d.rainfall_anomaly_pct}%` : 'Normal'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
