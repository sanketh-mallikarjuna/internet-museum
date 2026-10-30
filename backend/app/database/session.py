import logging
from typing import Generator
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

logger = logging.getLogger(__name__)


def create_configured_engine():
    """
    Creates the SQLAlchemy engine based on configuration.
    Attempts primary connection (MySQL). If MySQL is unreachable due to missing
    credentials or service offline, gracefully falls back to local SQLite database
    to ensure uninterrupted application availability and demonstration.
    """
    url = settings.sync_database_url
    connect_args = {}
    if url.startswith("sqlite"):
        connect_args["check_same_thread"] = False

    try:
        eng = create_engine(
            url,
            connect_args=connect_args,
            pool_pre_ping=True,
            pool_recycle=3600,
            echo=False,
        )
        with eng.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info(f"Connected to database successfully: {eng.url.drivername}")
        return eng
    except Exception as e:
        if not url.startswith("sqlite"):
            logger.warning(
                f"Could not connect to primary database at {settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME} ({e}). "
                "Falling back to local SQLite database ('internet_museum.db') for demonstration."
            )
            return create_engine(
                "sqlite:///./internet_museum.db",
                connect_args={"check_same_thread": False},
                pool_pre_ping=True,
            )
        raise e


engine = create_configured_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """Dependency that provides a transactional SQLAlchemy session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Create all tables in the database if they do not exist."""
    from app.database.base import Base
    import app.models  # Ensure all models are registered on Base.metadata

    logger.info("Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database schema initialized successfully.")
