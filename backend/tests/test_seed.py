from app.models.wing import MuseumWing
from app.models.exhibit import Exhibit
from app.models.trail import MuseumTrail
from app.services.seed_service import seed_museum_data


def test_seed_record_counts(db_session):
    """Verify exact count of seeded records in database."""
    total_wings = db_session.query(MuseumWing).count()
    total_exhibits = db_session.query(Exhibit).count()
    total_trails = db_session.query(MuseumTrail).count()

    assert total_wings == 5, f"Expected 5 wings, got {total_wings}"
    assert total_exhibits == 30, f"Expected 30 exhibits, got {total_exhibits}"
    assert total_trails == 3, f"Expected 3 trails, got {total_trails}"


def test_seed_idempotency(db_session):
    """Verify that rerunning seed_museum_data does not produce duplicate records."""
    counts1 = seed_museum_data(db_session)
    counts2 = seed_museum_data(db_session)

    assert counts1["wings"] == 5
    assert counts1["exhibits"] == 30
    assert counts1["trails"] == 3

    assert counts2["wings"] == 5
    assert counts2["exhibits"] == 30
    assert counts2["trails"] == 3
