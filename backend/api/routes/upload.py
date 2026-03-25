# ──────────────────────────────────────────────
#  api/routes/upload.py
#  Upload endpoint — Arpita owns error handling
#  and response validation sections (marked ✅)
#  Author: Arpita (error handling + validation)
#  Author: Pratham (core upload logic — placeholder)
# ──────────────────────────────────────────────

import io
import pandas as pd
from datetime            import datetime
from fastapi             import APIRouter, UploadFile, File
from fastapi.responses   import JSONResponse
from pathlib             import Path

from models.schemas          import UploadSuccessResponse
from utils.error_handler     import raise_upload_error, build_error_response
from utils.response_validator import UploadValidator, run_all_validations_on_df
from utils.error_messages    import ALLOWED_EXTENSIONS

router = APIRouter(prefix="/upload", tags=["Upload"])


# ─────────────────────────────────────────────
#  POST /upload/
#  Main dataset upload endpoint
# ─────────────────────────────────────────────
@router.post(
    "/",
    response_model    = UploadSuccessResponse,
    responses         = {
        400: {"description": "No file / empty file"},
        413: {"description": "File too large"},
        415: {"description": "Invalid file type"},
        422: {"description": "Missing columns or parse error"},
        500: {"description": "Database error"},
    },
    summary           = "Upload a sales dataset (CSV or Excel)",
)
async def upload_dataset(file: UploadFile = File(...)):
    """
    Upload a CSV or Excel sales dataset for forecasting.

    - File must contain **date** and **sales** columns
    - Maximum file size: **50 MB**
    - Accepted formats: **.csv**, **.xlsx**, **.xls**
    """

    validator = UploadValidator()

    # ✅ ARPITA — Validation 1: File present
    is_valid, err = validator.validate_file_present(file)
    if not is_valid:
        return raise_upload_error(err)

    # ✅ ARPITA — Validation 2: File extension
    is_valid, err = validator.validate_file_extension(file.filename)
    if not is_valid:
        return raise_upload_error(err)

    # ✅ ARPITA — Validation 3: File size + empty check
    is_valid, err = await validator.validate_file_size(file)
    if not is_valid:
        return raise_upload_error(err)

    # ── Read file into DataFrame ──────────────
    try:
        content = await file.read()
        ext     = Path(file.filename).suffix.lower()

        if ext == ".csv":
            df = pd.read_csv(io.BytesIO(content))
        else:
            df = pd.read_excel(io.BytesIO(content))

    except Exception as e:
        # ✅ ARPITA — Error: corrupt / unreadable file
        return raise_upload_error("CORRUPT_FILE")

    # ✅ ARPITA — Validation 4 & 5: Empty + required columns
    is_valid, err = run_all_validations_on_df(df)
    if not is_valid:
        return raise_upload_error(err)

    # ── Store metadata in DB (Niranjan's code goes here) ──
    # TODO: Replace with real DB call once Niranjan's module is ready
    try:
        # Placeholder — simulates what DB will return
        dataset_id  = 101                                # Will come from DB insert
        row_count   = len(df)
        uploaded_at = datetime.utcnow().isoformat()

    except Exception:
        # ✅ ARPITA — Error: DB failure
        return raise_upload_error("DB_ERROR")

    # ✅ ARPITA — Build and return validated success response
    response = UploadSuccessResponse(
        dataset_id  = dataset_id,
        status      = "Upload Successful",
        filename    = file.filename,
        row_count   = row_count,
        uploaded_at = uploaded_at,
    )
    return JSONResponse(status_code=201, content=response.model_dump())


# ─────────────────────────────────────────────
#  GET /upload/datasets
#  List all uploaded datasets
# ─────────────────────────────────────────────
@router.get("/datasets", summary="List all uploaded datasets")
async def list_datasets():
    """
    Returns a list of all active datasets.
    (Connects to Niranjan's DB layer)
    """
    # TODO: Replace with real DB query
    return {
        "total"   : 0,
        "datasets": [],
        "message" : "DB not connected yet — placeholder response",
    }
