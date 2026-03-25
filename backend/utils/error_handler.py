# ──────────────────────────────────────────────
#  utils/error_handler.py
#  Handles all upload errors and builds responses
#  Author: Arpita
# ──────────────────────────────────────────────

from fastapi.responses import JSONResponse
from utils.error_messages import ERROR_MESSAGES


def raise_upload_error(error_code: str) -> JSONResponse:
    """
    Takes an error code string, returns a proper JSONResponse with
    correct HTTP status code and clean error message.
    """

    # Map each error code → correct HTTP status code
    STATUS_CODE_MAP = {
        "NO_FILE"         : 400,
        "EMPTY_FILE"      : 400,
        "INVALID_TYPE"    : 415,
        "FILE_TOO_LARGE"  : 413,
        "MISSING_COLUMNS" : 422,
        "CORRUPT_FILE"    : 422,
        "PARSE_ERROR"     : 422,
        "DB_ERROR"        : 500,
    }

    code        = error_code.upper()
    status_code = STATUS_CODE_MAP.get(code, 400)  # default 400 if unknown

    return JSONResponse(
        status_code = status_code,
        content     = build_error_response(code),
    )


def build_error_response(error_code: str) -> dict:
    """
    Builds a clean, consistent error response dictionary.
    Never exposes stack traces or internal code details.
    """
    key     = error_code.lower()
    message = ERROR_MESSAGES.get(key, "An unexpected error occurred. Please try again.")

    return {
        "status"     : "Upload Failed",
        "message"    : message,
        "error_code" : error_code.upper(),
    }