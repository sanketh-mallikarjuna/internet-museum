def test_health_check_endpoint(client):
    """Test that GET /api/v1/health returns HTTP 200 with UP status."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "UP"
    assert data["database"] == "UP"
    assert data["version"] == "1.0.0"
    assert "timestamp" in data
