def test_get_all_exhibits(client):
    """Test retrieving all exhibits (30 total)."""
    response = client.get("/api/v1/exhibits")
    assert response.status_code == 200

    exhibits = response.json()
    assert len(exhibits) == 30

    # Verify first exhibit structure
    sample = exhibits[0]
    assert "id" in sample
    assert "title" in sample
    assert "url" in sample
    assert "wingId" in sample
    assert "tagline" in sample
    assert "curatorNotes" in sample
    assert "interactionLevel" in sample
    assert "tags" in sample
    assert isinstance(sample["tags"], list)
    assert len(sample["tags"]) > 0


def test_get_exhibits_by_wing(client):
    """Test filtering exhibits by wingId."""
    response = client.get("/api/v1/exhibits?wingId=generative")
    assert response.status_code == 200

    exhibits = response.json()
    assert len(exhibits) == 6
    assert all(e["wingId"] == "generative" for e in exhibits)


def test_get_exhibits_search(client):
    """Test searching exhibits by keyword."""
    response = client.get("/api/v1/exhibits?search=Neal")
    assert response.status_code == 200

    exhibits = response.json()
    assert len(exhibits) >= 1
    titles = [e["title"] for e in exhibits]
    assert "Neal.fun" in titles


def test_get_single_exhibit_by_id(client):
    """Test retrieving a single exhibit with full details and coordinates."""
    response = client.get("/api/v1/exhibits/neal-fun")
    assert response.status_code == 200

    exhibit = response.json()
    assert exhibit["id"] == "neal-fun"
    assert exhibit["title"] == "Neal.fun"
    assert exhibit["author"] == "Neal Agarwal"
    assert exhibit["wingId"] == "atrium"
    assert exhibit["year"] == 2019
    assert exhibit["isCuratorPick"] is True
    assert exhibit["coords"] == {"x": 450.0, "y": 300.0}
    assert "simulations" in exhibit["tags"]


def test_get_single_exhibit_not_found(client):
    """Test 404 response for nonexistent exhibit."""
    response = client.get("/api/v1/exhibits/unknown-exhibit-404")
    assert response.status_code == 404
    data = response.json()
    assert "detail" in data
