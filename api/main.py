import os
import shutil
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

# Router Setup
router = APIRouter(prefix="/upload", tags=["Upload"])

# Directory where uploaded files will be saved
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls"}

# Max file size: 50 MB (in bytes)
MAX_FILE_SIZE = 50 * 1024 * 1024


# Helper: Detect file extension
def get_file_extension(filename: str) -> str:
    """
    Extracts and returns the lowercase file extension.
    Example: 'sales_data.CSV' → '.csv'
    """
    _, ext = os.path.splitext(filename)
    return ext.lower()


# Helper: Validate file type
def is_valid_file_type(filename: str) -> bool:
    """
    Returns True if the file extension is one of the allowed types.
    Allowed: .csv, .xlsx, .xls
    """
    ext = get_file_extension(filename)
    return ext in ALLOWED_EXTENSIONS


# ──────────────────────────────────────────────
# Helper: Save file to disk
# ──────────────────────────────────────────────
def save_upload_to_disk(file: UploadFile) -> tuple[str, int]:
    """
    Reads the uploaded file content, checks its size,
    and saves it to the UPLOAD_DIR with a unique filename.

    Returns:
        - saved_path (str): Full path where the file was saved
        - file_size (int): Size of the file in bytes

    Raises:
        HTTPException 413: If the file exceeds MAX_FILE_SIZE
    """
    # Read all file bytes into memory
    file_bytes = file.file.read()
    file_size = len(file_bytes)

    # Check file size limit
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum allowed size is 50 MB. "
                   f"Your file is {round(file_size / (1024 * 1024), 2)} MB."
        )

    # Generate a unique filename to avoid overwriting existing files
    # Example: "sales_data.csv" → "a3f9c1b2-sales_data.csv"
    unique_filename = f"{uuid.uuid4().hex[:8]}-{file.filename}"
    saved_path = os.path.join(UPLOAD_DIR, unique_filename)

    # Write the file bytes to disk
    with open(saved_path, "wb") as buffer:
        buffer.write(file_bytes)

    return saved_path, file_size


# POST /upload/
# Main Upload Endpoint — Pratham's responsibility
@router.post("/")
async def upload_dataset(file: UploadFile = File(...)):
    """
    Accepts a CSV or Excel sales dataset upload.

    Steps performed by this endpoint:
        1. Validates the file type (must be .csv, .xlsx, or .xls)
        2. Reads and checks the file size (max 50 MB)
        3. Saves the file to the uploads/ directory with a unique name
        4. Returns file metadata for the next module (preprocessing)

    NOTE:
        - dataset_id generation and database storage is handled by Niranjan's module.
        - Column validation (date, sales presence) is handled by Arpita's module.
        - This endpoint returns a temporary file_path and metadata for handoff.

    Args:
        file (UploadFile): The uploaded file from the client.

    Returns:
        JSONResponse with file metadata on success.

    Raises:
        HTTPException 400: If file type is not allowed.
        HTTPException 413: If file exceeds 50 MB.
        HTTPException 500: If an unexpected error occurs during save.
    """

    # ── Step 1: Validate file type ──
    if not is_valid_file_type(file.filename):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{get_file_extension(file.filename)}'. "
                   f"Only CSV (.csv) and Excel (.xlsx, .xls) files are accepted."
        )

    # ── Step 2 & 3: Check size and save to disk ──
    try:
        saved_path, file_size = save_upload_to_disk(file)
    except HTTPException:
        # Re-raise size limit errors as-is
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save the uploaded file. Please try again. Error: {str(e)}"
        )

    # ── Step 4: Return file metadata for handoff to Niranjan's DB module ──
    return JSONResponse(
        status_code=200,
        content={
            "status": "Upload Successful",
            "original_filename": file.filename,
            "saved_path": saved_path,
            "file_type": get_file_extension(file.filename),
            "file_size_mb": round(file_size / (1024 * 1024), 4),
            # dataset_id will be added by Niranjan's DB module
            # column validation will be done by Arpita's module
            "message": "File received and saved. Awaiting database registration."
        }
    )