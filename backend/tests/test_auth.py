import pytest
from app.models.user import User


def test_register_curator_success(client, db_session):
    """Test successful registration with secure password hashing and JWT issuance."""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "curator.ada@internetmuseum.org",
            "password": "curatorPassword123!",
            "username": "Ada Lovelace",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert "accessToken" in data or "access_token" in data
    token = data.get("accessToken") or data.get("access_token")
    assert token is not None and len(token) > 20

    user_data = data["user"]
    assert user_data["email"] == "curator.ada@internetmuseum.org"
    assert user_data["username"] == "Ada Lovelace"
    assert user_data["role"] == "curator"

    # Verify password is NEVER stored in plaintext in the database
    db_user = db_session.query(User).filter(User.email == "curator.ada@internetmuseum.org").first()
    assert db_user is not None
    assert db_user.hashed_password != "curatorPassword123!"
    assert db_user.hashed_password.startswith("$2b$") or db_user.hashed_password.startswith("$2a$")


def test_register_duplicate_email_rejected(client):
    """Test duplicate registration returns 400 with clear message."""
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "duplicate@internetmuseum.org",
            "password": "validPassword123",
            "username": "Curator One",
        },
    )
    # Attempt second registration with same email
    dup_res = client.post(
        "/api/v1/auth/register",
        json={
            "email": "duplicate@internetmuseum.org",
            "password": "anotherPassword456",
            "username": "Curator Two",
        },
    )
    assert dup_res.status_code == 400
    assert "already registered" in dup_res.json()["detail"].lower()


def test_register_short_password_rejected(client):
    """Test passwords under 6 characters are rejected by Pydantic validation."""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "shortpass@internetmuseum.org",
            "password": "123",
            "username": "Short Pass",
        },
    )
    assert response.status_code == 422


def test_login_success(client):
    """Test login with correct email and password returns JWT token."""
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "login.test@internetmuseum.org",
            "password": "secureCuratorPass99",
            "username": "Login Tester",
        },
    )
    login_res = client.post(
        "/api/v1/auth/login",
        json={
            "email": "login.test@internetmuseum.org",
            "password": "secureCuratorPass99",
        },
    )
    assert login_res.status_code == 200
    data = login_res.json()
    token = data.get("accessToken") or data.get("access_token")
    assert token is not None
    assert data["user"]["email"] == "login.test@internetmuseum.org"


def test_login_invalid_password_rejected(client):
    """Test login with wrong password returns 401 Unauthorized."""
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "wrongpass@internetmuseum.org",
            "password": "correctPassword",
            "username": "Wrong Pass Tester",
        },
    )
    login_res = client.post(
        "/api/v1/auth/login",
        json={
            "email": "wrongpass@internetmuseum.org",
            "password": "incorrectPassword!",
        },
    )
    assert login_res.status_code == 401
    assert "invalid" in login_res.json()["detail"].lower()


def test_login_nonexistent_email_rejected(client):
    """Test login with non-existent email returns 401 Unauthorized."""
    login_res = client.post(
        "/api/v1/auth/login",
        json={
            "email": "ghost@internetmuseum.org",
            "password": "somePassword",
        },
    )
    assert login_res.status_code == 401


def test_get_me_protected_endpoint(client):
    """Test protected GET /api/v1/auth/me returns authenticated curator profile."""
    reg_res = client.post(
        "/api/v1/auth/register",
        json={
            "email": "profile@internetmuseum.org",
            "password": "profilePassword!",
            "username": "Profile Curator",
        },
    )
    token = reg_res.json().get("accessToken") or reg_res.json().get("access_token")

    # Request without token -> 401 or 403
    unauth_res = client.get("/api/v1/auth/me")
    assert unauth_res.status_code in (401, 403)

    # Request with valid Bearer token -> 200
    auth_res = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert auth_res.status_code == 200
    profile = auth_res.json()
    assert profile["email"] == "profile@internetmuseum.org"
    assert profile["username"] == "Profile Curator"
    assert "role" in profile
