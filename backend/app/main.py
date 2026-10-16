"""
MausamIQ: Agricultural Climate-Risk Intelligence & Decision-Support Platform.
Main FastAPI Application Entrypoint.
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from backend.app.config import settings
from backend.app.api.v1.router import api_router

# Logging configuration
logging.basicConfig(
    level=settings.LOG_LEVEL,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("mausamiq")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Explainable, data-driven agricultural climate-risk assessment and decision-support "
        "framework for Maharashtra, India. Features deterministic rule engines, "
        "trilingual support (English, Hindi, Marathi), and Web Speech voice interfaces."
    ),
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local frontend development across ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API v1 Routes
app.include_router(api_router, prefix="/api/v1")
app.include_router(api_router, prefix="/api")  # Backward compatibility alias


@app.get("/")
def root():
    """Root platform discovery endpoint."""
    return {
        "platform": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "geography": "Maharashtra, India (36 Districts)",
        "docs_url": "/docs",
        "redoc_url": "/redoc",
        "health_check": "/api/v1/health",
        "api_v1": "/api/v1"
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An error occurred while processing the scientific assessment.",
            "path": request.url.path
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
