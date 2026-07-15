from app.prompts.layout_prompt import build_user_prompt, SYSTEM_PROMPT


def test_build_user_prompt_includes_all_fields():
    p = build_user_prompt(
        title="My Book", objective="Teach AI",
        page_text="Some content here", image_count=2,
    )
    assert "My Book" in p
    assert "Teach AI" in p
    assert "Some content here" in p
    assert "2" in p


def test_build_user_prompt_handles_missing_context():
    p = build_user_prompt(title=None, objective=None, page_text="x", image_count=0)
    assert "Not Provided" in p


def test_build_user_prompt_states_image_bound():
    p = build_user_prompt(title=None, objective=None, page_text="x", image_count=3)
    # The prompt must tell the model not to exceed the available image count.
    assert "3" in p


def test_system_prompt_declares_allowed_layout_types():
    for layout_type in ("hero", "split", "magazine"):
        assert layout_type in SYSTEM_PROMPT
    assert "JSON" in SYSTEM_PROMPT
