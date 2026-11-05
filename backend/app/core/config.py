from typing import List, Union
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, field_validator
import os


class Settings(BaseSettings):
    PROJECT_NAME: str = "M.A.B TRADERS Mandi Billing System"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Database
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str = ""
    DB_NAME: str = "mab_traders_db"

    # Security
    SECRET_KEY: str = "dev-secret-key-mab-traders-billing-system-2026"
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    # Mandi Default Charges
    DEFAULT_COMMISSION_PERCENT: float = 2.5
    DEFAULT_MANDI_TAX_PERCENT: float = 1.0
    DEFAULT_DEVELOPMENT_CESS_PERCENT: float = 0.5
    DEFAULT_LABOUR_PER_BAG: float = 10.0
    DEFAULT_WEIGHING_PER_BAG: float = 3.0

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        # Using PyMySQL driver for MySQL connection
        password_part = f":{self.DB_PASSWORD}" if self.DB_PASSWORD else ""
        return f"mysql+pymysql://{self.DB_USER}{password_part}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}?charset=utf8mb4"

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"


settings = Settings()
