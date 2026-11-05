"""FastAPI API dependencies."""
from typing import Generator
from app.core.database import get_db

# Re-export get_db
__all__ = ["get_db"]
