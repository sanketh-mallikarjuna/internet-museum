def test_get_all_trails(client):
    """Test retrieving all preset museum trails."""
    response = client.get("/api/v1/trails")
    assert response.status_code == 200

    trails = response.json()
    assert len(trails) == 3

    trail_map = {t["id"]: t for t in trails}
    assert "trail-retro-capsule" in trail_map
    assert "trail-generative-reverie" in trail_map
    assert "trail-absurdist-curiosities" in trail_map


def test_trail_stops_order(client):
    """Test that trail stops maintain strict sequential ordering."""
    response = client.get("/api/v1/trails")
    assert response.status_code == 200

    trails = response.json()
    retro_trail = next(t for t in trails if t["id"] == "trail-retro-capsule")

    expected_exhibit_ids = [
        "internet-archive",
        "space-jam-1996",
        "million-dollar-homepage",
        "camerons-world",
        "windows-93",
    ]
    assert retro_trail["exhibitIds"] == expected_exhibit_ids

    # Verify stops list
    stops = retro_trail["stops"]
    assert len(stops) == 5
    for i, expected_id in enumerate(expected_exhibit_ids):
        assert stops[i]["stopOrder"] == i
        assert stops[i]["exhibitId"] == expected_id
