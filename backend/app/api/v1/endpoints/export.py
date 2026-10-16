"""
MausamIQ Audit Report Export Endpoint.
Generates printable, auditable summary reports with full provenance and citations.
"""
from fastapi import APIRouter
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter()


class ExportReportRequest(BaseModel):
    assessment_data: Dict[str, Any]


@router.post("/export/html", tags=["Export"])
def export_html_report(req: ExportReportRequest):
    """
    Renders an auditable HTML report ready for printing or PDF archiving.
    """
    data = req.assessment_data
    dist = data.get("district", {})
    crop = data.get("crop", {})
    risk = data.get("risk_assessment", {})
    prov = data.get("provenance", {})
    phen = data.get("phenology", {})
    ind = data.get("meteorological_indicators", {})
    triggered = risk.get("triggered_rules", [])
    
    rules_html = ""
    for r in triggered:
        rules_html += f"""
        <div style="border-left: 4px solid #C53030; padding: 10px 15px; margin-bottom: 12px; background: #FFF5F5;">
            <strong>Rule: {r.get('rule_id')}</strong> (Severity: {r.get('severity', '').upper()})<br/>
            <span>{r.get('explanation')}</span><br/>
            <small style="color: #666;">Observed: {r.get('observed_value')} {r.get('unit')} ({r.get('operator')} {r.get('threshold')} {r.get('unit')})</small><br/>
            <small style="color: #2D3748;">Citation: {r.get('citation')}</small>
        </div>
        """
        
    if not rules_html:
        rules_html = "<p style='color: #2F855A;'>No critical risk thresholds were triggered for this period.</p>"
        
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8"/>
        <title>MausamIQ Climate-Risk Assessment Report</title>
        <style>
            body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #2D3748; line-height: 1.5; }}
            .header {{ border-bottom: 2px solid #1E5E3A; padding-bottom: 15px; margin-bottom: 25px; }}
            .title {{ font-size: 24px; color: #1E5E3A; font-weight: bold; margin: 0; }}
            .meta {{ color: #718096; font-size: 14px; margin-top: 5px; }}
            .grid {{ display: flex; gap: 20px; margin-bottom: 25px; }}
            .card {{ flex: 1; border: 1px solid #E2E8F0; border-radius: 8px; padding: 15px; background: #F7FAFC; }}
            .card h3 {{ margin-top: 0; font-size: 16px; color: #2D3748; border-bottom: 1px solid #CBD5E0; padding-bottom: 6px; }}
            .badge {{ display: inline-block; padding: 4px 10px; border-radius: 4px; font-weight: bold; text-transform: uppercase; }}
            .badge-low {{ background: #C6F6D5; color: #22543D; }}
            .badge-moderate {{ background: #FEFCBF; color: #744210; }}
            .badge-high {{ background: #FED7D7; color: #742A2A; }}
            .footer {{ margin-top: 40px; border-top: 1px solid #E2E8F0; padding-top: 15px; font-size: 12px; color: #A0AEC0; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1 class="title">MausamIQ Agricultural Climate-Risk Audit Report</h1>
            <div class="meta">Assessment ID: {data.get('assessment_id')} | Generated: {data.get('timestamp')}</div>
        </div>

        <div class="grid">
            <div class="card">
                <h3>Geographic & Agro-Climatic Profile</h3>
                <p><strong>District:</strong> {dist.get('name')} ({dist.get('name_en')})</p>
                <p><strong>Agro-Climatic Zone:</strong> {dist.get('zone')}</p>
                <p><strong>Coordinates:</strong> {dist.get('latitude')}, {dist.get('longitude')}</p>
            </div>
            <div class="card">
                <h3>Crop & Phenology Profile</h3>
                <p><strong>Crop:</strong> {crop.get('name')} (<em>{crop.get('botanical_name')}</em>)</p>
                <p><strong>Growth Stage:</strong> {phen.get('stage_name')} (DAS: {phen.get('days_after_sowing')})</p>
                <p><strong>Water Requirement:</strong> {crop.get('water_requirement_mm')} mm</p>
            </div>
            <div class="card">
                <h3>Overall Assessment</h3>
                <p><strong>Risk Category:</strong> <span class="badge badge-{risk.get('overall_category')}">{risk.get('overall_category')}</span></p>
                <p><strong>Numeric Exposure Score:</strong> {risk.get('risk_score_numeric')} / 100</p>
                <p><strong>Rainfall Departure:</strong> {ind.get('rainfall_anomaly_pct')}%</p>
            </div>
        </div>

        <div class="card" style="margin-bottom: 25px;">
            <h3>Scientific Rule Evaluation & Traceability Audit</h3>
            {rules_html}
        </div>

        <div class="card" style="margin-bottom: 25px;">
            <h3>Actionable Agronomic Advisory</h3>
            <p>{risk.get('advisory')}</p>
        </div>

        <div class="card">
            <h3>Data Provenance & Scientific Integrity</h3>
            <p><strong>Primary Meteorological Source:</strong> {prov.get('data_source')}</p>
            <p><strong>Baseline Climatology:</strong> {prov.get('baseline_period')}</p>
            <p><strong>Data Completeness:</strong> {prov.get('completeness_pct')}%</p>
            <p><strong>Rule Registry Version:</strong> {prov.get('rule_set_version')}</p>
        </div>

        <div class="footer">
            MausamIQ is an explainable decision-support system. Assessments represent climatic exposure risk and do not constitute guaranteed yield loss predictions or actuarial claims.
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html, status_code=200)
