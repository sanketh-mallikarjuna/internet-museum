import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    decode_access_token,
)
from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import (
    UserRegister,
    UserLogin,
    UserProfile,
    TokenResponse,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer(auto_error=True)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """Dependency that decodes bearer JWT and retrieves the authenticated curator."""
    token = credentials.credentials
    try:
        payload = decode_access_token(token)
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token payload",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Curator profile not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Curator account is deactivated",
        )
    return user


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    """Register a new museum curator account with secure password hashing."""
    normalized_email = payload.email.strip().lower()

    # Check for duplicate email
    existing_user = db.query(User).filter(func.lower(User.email) == normalized_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered. Please sign in or use another email address.",
        )

    # Securely hash password using bcrypt
    hashed = get_password_hash(payload.password)

    new_user = User(
        id=str(uuid.uuid4()),
        email=normalized_email,
        username=payload.username.strip(),
        hashed_password=hashed,
        role=payload.role or "curator",
        avatar=payload.avatar or "🏛️",
        is_active=True,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generate genuine JWT access token
    access_token = create_access_token(
        data={"sub": new_user.id, "email": new_user.email, "role": new_user.role}
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserProfile.model_validate(new_user),
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    """Authenticate curator credentials and return signed JWT."""
    normalized_email = payload.email.strip().lower()

    user = db.query(User).filter(func.lower(User.email) == normalized_email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Curator account is deactivated",
        )

    # Generate genuine JWT access token
    access_token = create_access_token(
        data={"sub": user.id, "email": user.email, "role": user.role}
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserProfile.model_validate(user),
    )


@router.get("/me", response_model=UserProfile)
def get_me(current_user: User = Depends(get_current_user)):
    """Return profile details for the currently authenticated curator."""
    return UserProfile.model_validate(current_user)
