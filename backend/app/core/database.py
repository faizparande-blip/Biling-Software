import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

logger = logging.getLogger(__name__)

# Primary database: MySQL, with graceful SQLite fallback for immediate out-of-the-box readiness
engine = None
try:
    mysql_engine = create_engine(
        settings.SQLALCHEMY_DATABASE_URI,
        pool_pre_ping=True,
        pool_recycle=3600,
        pool_size=10,
        max_overflow=20,
    )
    # Test connection
    with mysql_engine.connect() as conn:
        pass
    engine = mysql_engine
    logger.info("Successfully connected to MySQL database.")
except Exception as e:
    logger.warning(
        f"MySQL connection not ready ({e}). Falling back to local SQLite database (mab_traders.db) for persistent reliability."
    )
    engine = create_engine(
        "sqlite:///./mab_traders.db",
        connect_args={"check_same_thread": False},
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI dependency to provide a transactional database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
