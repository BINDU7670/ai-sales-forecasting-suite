# ──────────────────────────────────────────────
#  utils/error_messages.py
#  All error messages and constants for upload module
#  Author: Arpita
# ──────────────────────────────────────────────

# ── File type and size constants ──────────────
ALLOWED_EXTENSIONS  = {".csv", ".xlsx", ".xls"}
MAX_FILE_SIZE_MB    = 50
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

# ── Required columns (standard names) ────────
REQUIRED_COLUMNS = {"date", "sales"}

# ── Column aliases ────────────────────────────
# Handles real-world datasets that use different column names
# e.g. Madhav Store Dataset uses "Order Date" and "Amount"
COLUMN_ALIASES = {
    "date": {
        "date",
        "order date",
        "order_date",
        "transaction_date",
        "sale_date",
        "invoice_date",
    },
    "sales": {
        "sales",
        "amount",
        "revenue",
        "sale_amount",
        "total_amount",
        "total_sales",
        "price",
    },
}

# ── Error messages ────────────────────────────
ERROR_MESSAGES = {
    "no_file"         : "No file was uploaded. Please attach a CSV or Excel file.",
    "invalid_type"    : "Invalid file type. Only CSV (.csv) and Excel (.xlsx, .xls) files are allowed.",
    "file_too_large"  : f"File size exceeds the maximum allowed limit of {MAX_FILE_SIZE_MB} MB.",
    "empty_file"      : "The uploaded file is empty. Please upload a file with data.",
    "missing_columns" : "Required columns are missing. Dataset must contain 'date' (or 'Order Date') and 'sales' (or 'Amount') columns.",
    "corrupt_file"    : "The file could not be read. Please check the file format and try again.",
    "parse_error"     : "Failed to parse the file. Ensure the file is not password-protected or corrupted.",
    "db_error"        : "A database error occurred while saving the dataset. Please try again.",
}