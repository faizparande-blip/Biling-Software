from fastapi import APIRouter

router = APIRouter()


@router.post("/login")
def login():
    """User login endpoint (skeleton)."""
    return {"message": "Login endpoint ready for Phase 2 implementation", "status": "ok"}


@router.get("/me")
def get_current_user():
    """Get authenticated user endpoint (skeleton)."""
    return {"username": "admin", "role": "admin", "firm": "M.A.B TRADERS"}
