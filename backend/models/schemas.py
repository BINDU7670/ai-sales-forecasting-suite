# ──────────────────────────────────────────────
#  models/schemas.py
#  Pydantic request/response models for upload module
#  Author: Arpita
# ──────────────────────────────────────────────

from pydantic import BaseModel, Field
from typing   import Optional
from datetime import datetime


# ── Success Response ──────────────────────────
class UploadSuccessResponse(BaseModel):
    """Returned when a dataset is uploaded successfully."""
    dataset_id : int    = Field(..., example=101)
    status     : str    = Field(..., example="Upload Successful")
    filename   : str    = Field(..., example="sales_data.csv")
    row_count  : int    = Field(..., example=365)
    uploaded_at: str    = Field(..., example="2024-01-01T10:00:00")

    class Config:
        json_schema_extra = {
            "example": {
                "dataset_id" : 101,
                "status"     : "Upload Successful",
                "filename"   : "sales_data.csv",
                "row_count"  : 365,
                "uploaded_at": "2024-01-01T10:00:00",
            }
        }


# ── Error Response ────────────────────────────
class UploadErrorResponse(BaseModel):
    """Returned when upload fails for any reason."""
    status     : str = Field(..., example="Upload Failed")
    message    : str = Field(..., example="Required columns are missing.")
    error_code : str = Field(..., example="MISSING_COLUMNS")

    class Config:
        json_schema_extra = {
            "example": {
                "status"    : "Upload Failed",
                "message"   : "Required columns are missing.",
                "error_code": "MISSING_COLUMNS",
            }
        }


# ── Dataset List Item ─────────────────────────
class DatasetMetadata(BaseModel):
    """Metadata for a single stored dataset."""
    dataset_id  : int
    filename    : str
    row_count   : int
    uploaded_at : str
    status      : str = "active"


# ── Dataset List Response ─────────────────────
class DatasetListResponse(BaseModel):
    """Returned when listing all datasets."""
    total    : int
    datasets : list[DatasetMetadata]
