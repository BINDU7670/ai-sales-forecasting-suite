# ──────────────────────────────────────────────
#  utils/response_validator.py
#  Validates uploaded file before processing
#  Author: Arpita
# ──────────────────────────────────────────────

import pandas as pd
from pathlib  import Path
from fastapi  import UploadFile

from utils.error_messages import (
    ALLOWED_EXTENSIONS,
    MAX_FILE_SIZE_BYTES,
    COLUMN_ALIASES,
)


class UploadValidator:
    """
    Validates an uploaded file before it is processed.
    Each method returns (is_valid: bool, error_code: str | None).
    """

    @staticmethod
    def validate_file_present(file: UploadFile | None) -> tuple[bool, str | None]:
        """Check that a file was actually attached to the request."""
        if file is None or file.filename == "":
            return False, "NO_FILE"
        return True, None

    @staticmethod
    def validate_file_extension(filename: str) -> tuple[bool, str | None]:
        """Check that the file extension is CSV or Excel."""
        ext = Path(filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            return False, "INVALID_TYPE"
        return True, None

    @staticmethod
    async def validate_file_size(file: UploadFile) -> tuple[bool, str | None]:
        """Check that the file is not empty and does not exceed 50 MB."""
        content = await file.read()
        await file.seek(0)              # Reset pointer so file can be read again later

        if len(content) == 0:
            return False, "EMPTY_FILE"
        if len(content) > MAX_FILE_SIZE_BYTES:
            return False, "FILE_TOO_LARGE"
        return True, None

    @staticmethod
    def validate_required_columns(df: pd.DataFrame) -> tuple[bool, str | None]:
        """
        Check the DataFrame contains required columns.
        Uses COLUMN_ALIASES so real-world datasets like Madhav Store
        (which uses 'Order Date' and 'Amount') are also accepted.

        Example accepted column names:
          date  → 'date', 'order date', 'order_date', 'transaction_date'
          sales → 'sales', 'amount', 'revenue', 'total_amount'
        """
        # Normalize actual columns to lowercase for comparison
        actual_cols = {col.strip().lower() for col in df.columns}

        for required_col, aliases in COLUMN_ALIASES.items():
            # Check if ANY alias matches an actual column
            if not actual_cols.intersection(aliases):
                return False, "MISSING_COLUMNS"

        return True, None

    @staticmethod
    def validate_not_empty(df: pd.DataFrame) -> tuple[bool, str | None]:
        """Check the file has at least one row of data (not just headers)."""
        if df.empty:
            return False, "EMPTY_FILE"
        return True, None


def run_all_validations_on_df(df: pd.DataFrame) -> tuple[bool, str | None]:
    """
    Run all DataFrame-level validations in order.
    Stops and returns on first failure.
    """
    validator = UploadValidator()

    checks = [
        validator.validate_not_empty(df),
        validator.validate_required_columns(df),
    ]

    for is_valid, error_code in checks:
        if not is_valid:
            return False, error_code

    return True, None