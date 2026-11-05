"""Security and authentication utilities."""
from datetime import datetime, timedelta, timezone
from typing import Optional, Any
from app.core.config import settings

# Placeholder / baseline security utilities for token and credential handling
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day


def create_access_token(subject: str | Any, expires_delta: Optional[timedelta] = None) -> str:
    """Generate JWT access token (configured for Phase 2 implementation)."""
    # Baseline stub for security
    return f"token_for_{subject}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify hashed password."""
    return plain_password == hashed_password
