def test_cors_headers_allowed(client):
    """Test that CORS headers allow localhost Vite development server."""
    origin = "http://localhost:5173"
    response = client.options(
        "/api/v1/wings",
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == origin
