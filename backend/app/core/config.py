import os
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Internet Museum API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # MySQL database configuration
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str = ""
    DB_NAME: str = "internet_museum"

    # Direct database URL override (e.g. for CI, testing, or custom engines)
    DATABASE_URL: Optional[str] = None

    # JWT Authentication settings (configured via environment variables)
    JWT_SECRET_KEY: str = "internet-museum-curator-jwt-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Allowed CORS origins for frontend
        CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "https://main.dlumttn5sc1pi.amplifyapp.com",
        "https://d2ern1a8c850fe.cloudfront.net",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow",
    )

    @property
    def sync_database_url(self) -> str:
        """Returns the synchronous SQLAlchemy connection URL."""
        if self.DATABASE_URL:
            url = self.DATABASE_URL
            if url.startswith("mysql://"):
                url = url.replace("mysql://", "mysql+pymysql://", 1)
            return url

        # Construct MySQL connection string safely
        user = self.DB_USER
        password = f":{self.DB_PASSWORD}" if self.DB_PASSWORD else ""
        return f"mysql+pymysql://{user}{password}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}?charset=utf8mb4"


settings = Settings()
