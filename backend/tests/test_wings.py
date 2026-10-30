def test_get_all_wings(client):
    """Test retrieving all museum wings."""
    response = client.get("/api/v1/wings")
    assert response.status_code == 200

    wings = response.json()
    assert len(wings) == 5

    # Check order
    expected_ids = ["atrium", "generative", "retro-web", "curiosities", "interactive-fiction"]
    actual_ids = [w["id"] for w in wings]
    assert actual_ids == expected_ids

    # Check fields of the first wing
    atrium = wings[0]
    assert atrium["id"] == "atrium"
    assert atrium["name"] == "The Central Atrium"
    assert atrium["accentColor"] == "#38bdf8"
    assert atrium["icon"] == "🏛️"
    assert atrium["exhibitCount"] == 6
