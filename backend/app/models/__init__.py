"""Database models package."""
from app.core.database import Base
from app.models.bill import MandiBill

__all__ = ["Base", "MandiBill"]
