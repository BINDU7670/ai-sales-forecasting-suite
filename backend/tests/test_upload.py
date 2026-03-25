# ──────────────────────────────────────────────
#  tests/test_upload.py
#  Backend tests for upload module
#  Author: Arpita
#
#  Run with:  pytest tests/ -v
# ──────────────────────────────────────────────

import io
import pytest
import pandas as pd
from fastapi.testclient import TestClient
from main               import app

client = TestClient(app)


# ─────────────────────────────────────────────
#  Helpers — Build fake files for testing
# ─────────────────────────────────────────────

def make_csv(columns: list[str], rows: list[list]) -> bytes:
    """Build a CSV file in memory from given columns and rows."""
    df = pd.DataFrame(rows, columns=columns)
    return df.to_csv(index=False).encode("utf-8")


def make_excel(columns: list[str], rows: list[list]) -> bytes:
    """Build an Excel file in memory from given columns and rows."""
    df     = pd.DataFrame(rows, columns=columns)
    buffer = io.BytesIO()
    df.to_excel(buffer, index=False)
    return buffer.getvalue()


# ── Standard valid data ───────────────────────
VALID_COLUMNS = ["date", "sales"]
VALID_ROWS    = [
    ["2024-01-01", 1200],
    ["2024-01-02", 1500],
    ["2024-01-03", 1300],
]

# ── Madhav Store Dataset column names ─────────
MADHAV_COLUMNS = ["Order Date", "Amount"]
MADHAV_ROWS    = [
    ["01-01-2024", 1200],
    ["02-01-2024", 1500],
    ["03-01-2024", 1300],
]


# ─────────────────────────────────────────────
#  TEST GROUP 1 — Successful Uploads
# ─────────────────────────────────────────────

class TestSuccessfulUploads:

    def test_valid_csv_upload(self):
        """✅ Valid CSV should return 201 with dataset_id and status."""
        csv_bytes = make_csv(VALID_COLUMNS, VALID_ROWS)
        response  = client.post(
            "/upload/",
            files={"file": ("sales.csv", csv_bytes, "text/csv")},
        )
        assert response.status_code == 201
        data = response.json()
        assert data["status"]    == "Upload Successful"
        assert "dataset_id"      in data
        assert data["row_count"] == 3
        assert data["filename"]  == "sales.csv"
        assert "uploaded_at"     in data

    def test_valid_excel_xlsx_upload(self):
        """✅ Valid .xlsx file should upload successfully."""
        xlsx_bytes = make_excel(VALID_COLUMNS, VALID_ROWS)
        response   = client.post(
            "/upload/",
            files={"file": ("sales.xlsx", xlsx_bytes,
                   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")},
        )
        assert response.status_code == 201
        assert response.json()["status"] == "Upload Successful"

    def test_response_has_all_required_fields(self):
        """✅ Success response must include all schema fields."""
        csv_bytes = make_csv(VALID_COLUMNS, VALID_ROWS)
        response  = client.post(
            "/upload/",
            files={"file": ("sales.csv", csv_bytes, "text/csv")},
        )
        data     = response.json()
        required = {"dataset_id", "status", "filename", "row_count", "uploaded_at"}
        assert required.issubset(data.keys()), f"Missing fields: {required - data.keys()}"

    def test_column_names_case_insensitive(self):
        """✅ Columns named 'Date' and 'Sales' (uppercase) should also be accepted."""
        csv_bytes = make_csv(["Date", "Sales"], VALID_ROWS)
        response  = client.post(
            "/upload/",
            files={"file": ("sales.csv", csv_bytes, "text/csv")},
        )
        assert response.status_code == 201

    # ── NEW: Madhav Store Dataset tests ───────

    def test_madhav_store_csv_columns_accepted(self):
        """✅ Madhav dataset with 'Order Date' and 'Amount' columns should be accepted."""
        csv_bytes = make_csv(MADHAV_COLUMNS, MADHAV_ROWS)
        response  = client.post(
            "/upload/",
            files={"file": ("madhav_store.csv", csv_bytes, "text/csv")},
        )
        assert response.status_code == 201
        assert response.json()["status"] == "Upload Successful"

    def test_madhav_store_excel_columns_accepted(self):
        """✅ Madhav dataset as Excel with 'Order Date' and 'Amount' should be accepted."""
        xlsx_bytes = make_excel(MADHAV_COLUMNS, MADHAV_ROWS)
        response   = client.post(
            "/upload/",
            files={"file": ("madhav_store.xlsx", xlsx_bytes,
                   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")},
        )
        assert response.status_code == 201
        assert response.json()["status"] == "Upload Successful"

    def test_alias_column_amount_accepted(self):
        """✅ 'amount' column should be treated as alias for 'sales'."""
        csv_bytes = make_csv(["date", "amount"], VALID_ROWS)
        response  = client.post(
            "/upload/",
            files={"file": ("sales.csv", csv_bytes, "text/csv")},
        )
        assert response.status_code == 201

    def test_alias_column_revenue_accepted(self):
        """✅ 'revenue' column should be treated as alias for 'sales'."""
        csv_bytes = make_csv(["date", "revenue"], VALID_ROWS)
        response  = client.post(
            "/upload/",
            files={"file": ("sales.csv", csv_bytes, "text/csv")},
        )
        assert response.status_code == 201

    def test_alias_column_order_date_accepted(self):
        """✅ 'order_date' column should be treated as alias for 'date'."""
        csv_bytes = make_csv(["order_date", "sales"], VALID_ROWS)
        response  = client.post(
            "/upload/",
            files={"file": ("sales.csv", csv_bytes, "text/csv")},
        )
        assert response.status_code == 201


# ─────────────────────────────────────────────
#  TEST GROUP 2 — File Type Errors
# ─────────────────────────────────────────────

class TestFileTypeErrors:

    def test_rejects_pdf_file(self):
        """❌ PDF files should be rejected with 415."""
        response = client.post(
            "/upload/",
            files={"file": ("report.pdf", b"fake pdf content", "application/pdf")},
        )
        assert response.status_code == 415
        data = response.json()
        assert data["error_code"] == "INVALID_TYPE"
        assert data["status"]     == "Upload Failed"

    def test_rejects_txt_file(self):
        """❌ Plain text files should be rejected."""
        response = client.post(
            "/upload/",
            files={"file": ("data.txt", b"date,sales\n2024-01-01,100", "text/plain")},
        )
        assert response.status_code == 415
        assert response.json()["error_code"] == "INVALID_TYPE"

    def test_rejects_image_file(self):
        """❌ Image files should be rejected."""
        response = client.post(
            "/upload/",
            files={"file": ("photo.png", b"\x89PNG fake", "image/png")},
        )
        assert response.status_code == 415
        assert response.json()["error_code"] == "INVALID_TYPE"

    def test_rejects_no_extension(self):
        """❌ Files with no extension should be rejected."""
        response = client.post(
            "/upload/",
            files={"file": ("datafile", b"date,sales\n2024-01-01,100", "text/csv")},
        )
        assert response.status_code == 415


# ─────────────────────────────────────────────
#  TEST GROUP 3 — File Content Errors
# ─────────────────────────────────────────────

class TestFileContentErrors:

    def test_rejects_missing_sales_column(self):
        """❌ CSV without any sales alias column should fail with MISSING_COLUMNS."""
        csv_bytes = make_csv(["date", "quantity"], VALID_ROWS)
        response  = client.post(
            "/upload/",
            files={"file": ("bad.csv", csv_bytes, "text/csv")},
        )
        assert response.status_code == 422
        assert response.json()["error_code"] == "MISSING_COLUMNS"

    def test_rejects_missing_date_column(self):
        """❌ CSV without any date alias column should fail with MISSING_COLUMNS."""
        csv_bytes = make_csv(["product", "sales"], VALID_ROWS)
        response  = client.post(
            "/upload/",
            files={"file": ("bad.csv", csv_bytes, "text/csv")},
        )
        assert response.status_code == 422
        assert response.json()["error_code"] == "MISSING_COLUMNS"

    def test_rejects_both_columns_missing(self):
        """❌ CSV with neither required column should fail."""
        csv_bytes = make_csv(["product", "quantity"], [["shoes", 10]])
        response  = client.post(
            "/upload/",
            files={"file": ("bad.csv", csv_bytes, "text/csv")},
        )
        assert response.status_code == 422
        assert response.json()["error_code"] == "MISSING_COLUMNS"

    def test_rejects_empty_csv(self):
        """❌ CSV with headers only (no data rows) should fail."""
        csv_bytes = make_csv(VALID_COLUMNS, [])
        response  = client.post(
            "/upload/",
            files={"file": ("empty.csv", csv_bytes, "text/csv")},
        )
        assert response.status_code == 400
        assert response.json()["error_code"] == "EMPTY_FILE"

    def test_rejects_completely_empty_file(self):
        """❌ Zero-byte file should fail."""
        response = client.post(
            "/upload/",
            files={"file": ("empty.csv", b"", "text/csv")},
        )
        assert response.status_code == 400
        assert response.json()["error_code"] == "EMPTY_FILE"

    def test_rejects_corrupt_file(self):
        """❌ Corrupt/unreadable binary content should fail gracefully."""
        response = client.post(
            "/upload/",
            files={"file": ("corrupt.xlsx", b"\x00\x00GARBAGE\xFF\xFF",
                   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")},
        )
        assert response.status_code == 422
        assert response.json()["error_code"] == "CORRUPT_FILE"


# ─────────────────────────────────────────────
#  TEST GROUP 4 — Error Response Format
# ─────────────────────────────────────────────

class TestErrorResponseFormat:

    def test_error_response_has_required_fields(self):
        """✅ All error responses must have status, message, error_code."""
        response = client.post(
            "/upload/",
            files={"file": ("bad.pdf", b"content", "application/pdf")},
        )
        data     = response.json()
        required = {"status", "message", "error_code"}
        assert required.issubset(data.keys()), f"Missing fields: {required - data.keys()}"

    def test_error_status_is_upload_failed(self):
        """✅ All error responses must have status = 'Upload Failed'."""
        response = client.post(
            "/upload/",
            files={"file": ("bad.pdf", b"content", "application/pdf")},
        )
        assert response.json()["status"] == "Upload Failed"

    def test_error_message_is_human_readable(self):
        """✅ Error message should not expose stack traces or code."""
        response = client.post(
            "/upload/",
            files={"file": ("bad.pdf", b"content", "application/pdf")},
        )
        msg = response.json()["message"]
        assert "Traceback" not in msg
        assert "Exception" not in msg
        assert len(msg) > 10, "Message too short to be useful"


# ─────────────────────────────────────────────
#  TEST GROUP 5 — Endpoint Availability
# ─────────────────────────────────────────────

class TestEndpointAvailability:

    def test_upload_endpoint_exists(self):
        """✅ POST /upload/ should not return 404."""
        response = client.post("/upload/")
        assert response.status_code != 404

    def test_list_datasets_endpoint_exists(self):
        """✅ GET /upload/datasets should return 200."""
        response = client.get("/upload/datasets")
        assert response.status_code == 200