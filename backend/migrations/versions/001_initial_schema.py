"""Initial schema for museum wings, exhibits, tags, trails and trail stops.

Revision ID: 001_initial_schema
Revises:
Create Date: 2026-10-30 15:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1. Museum Wings
    op.create_table(
        "museum_wings",
        sa.Column("id", sa.String(length=32), nullable=False),
        sa.Column("name", sa.String(length=128), nullable=False),
        sa.Column("tagline", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("accent_color", sa.String(length=16), nullable=False),
        sa.Column("icon", sa.String(length=16), nullable=False),
        sa.Column("display_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_museum_wings_id"), "museum_wings", ["id"], unique=False)

    # 2. Exhibits Table
    op.create_table(
        "exhibits",
        sa.Column("id", sa.String(length=64), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("url", sa.String(length=1024), nullable=False),
        sa.Column("year_established", sa.Integer(), nullable=True),
        sa.Column("author", sa.String(length=255), nullable=True),
        sa.Column("wing_id", sa.String(length=32), nullable=False),
        sa.Column("tagline", sa.String(length=512), nullable=False),
        sa.Column("curator_notes", sa.Text(), nullable=False),
        sa.Column("interaction_level", sa.String(length=32), nullable=False, server_default="interactive"),
        sa.Column("thumbnail_url", sa.String(length=1024), nullable=True),
        sa.Column("is_curator_pick", sa.Boolean(), nullable=False, server_default=sa.text("0")),
        sa.Column("coord_x", sa.Float(), nullable=True),
        sa.Column("coord_y", sa.Float(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=True),
        sa.ForeignKeyConstraint(["wing_id"], ["museum_wings.id"], onupdate="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_exhibits_id"), "exhibits", ["id"], unique=False)
    op.create_index(op.f("ix_exhibits_title"), "exhibits", ["title"], unique=False)
    op.create_index(op.f("ix_exhibits_wing_id"), "exhibits", ["wing_id"], unique=False)

    # 3. Exhibit Keyword Tags
    op.create_table(
        "exhibit_tags",
        sa.Column("exhibit_id", sa.String(length=64), nullable=False),
        sa.Column("tag", sa.String(length=64), nullable=False),
        sa.ForeignKeyConstraint(["exhibit_id"], ["exhibits.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("exhibit_id", "tag"),
    )
    op.create_index(op.f("ix_exhibit_tags_tag"), "exhibit_tags", ["tag"], unique=False)

    # 4. Museum Trails
    op.create_table(
        "museum_trails",
        sa.Column("id", sa.String(length=64), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("curator_name", sa.String(length=128), nullable=False),
        sa.Column("estimated_minutes", sa.Integer(), nullable=True),
        sa.Column("is_staff_pick", sa.Boolean(), nullable=False, server_default=sa.text("0")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_museum_trails_id"), "museum_trails", ["id"], unique=False)

    # 5. Trail Tags
    op.create_table(
        "trail_tags",
        sa.Column("trail_id", sa.String(length=64), nullable=False),
        sa.Column("tag", sa.String(length=64), nullable=False),
        sa.ForeignKeyConstraint(["trail_id"], ["museum_trails.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("trail_id", "tag"),
    )
    op.create_index(op.f("ix_trail_tags_tag"), "trail_tags", ["tag"], unique=False)

    # 6. Trail Ordered Stops
    op.create_table(
        "trail_stops",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("trail_id", sa.String(length=64), nullable=False),
        sa.Column("exhibit_id", sa.String(length=64), nullable=False),
        sa.Column("stop_order", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=True),
        sa.ForeignKeyConstraint(["exhibit_id"], ["exhibits.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["trail_id"], ["museum_trails.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("trail_id", "stop_order", name="uk_trail_stop_order"),
    )
    op.create_index(op.f("ix_trail_stops_exhibit_id"), "trail_stops", ["exhibit_id"], unique=False)
    op.create_index(op.f("ix_trail_stops_trail_id"), "trail_stops", ["trail_id"], unique=False)


def downgrade() -> None:
    op.drop_table("trail_stops")
    op.drop_table("trail_tags")
    op.drop_table("museum_trails")
    op.drop_table("exhibit_tags")
    op.drop_table("exhibits")
    op.drop_table("museum_wings")
