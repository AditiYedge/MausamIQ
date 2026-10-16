"""
MausamIQ Backend Configuration.
Handles environment variables and validation through Pydantic Settings.
"""
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "MausamIQ: Agricultural Climate-Risk Intelligence"
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = "development"
    DEBUG: bool = True
    
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    SECRET_KEY: str = "dev_secret_key_change_in_production_9a8b7c6d5e4f3a2b1c"
    
    # CORS Origins (list of strings or comma-separated string)
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ]
    
    DATABASE_URL: str = "sqlite:///./app/db/mausamiq.db"
    LOG_LEVEL: str = "INFO"
    DEFAULT_BASELINE_PERIOD: str = "1981-2010"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
