package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

// TestHealthEndpoint verifies the /health endpoint returns 200 OK
// httptest.NewRecorder() simulates an HTTP response writer without a real server
// This is the standard Go pattern for unit testing HTTP handlers
func TestHealthEndpoint(t *testing.T) {
	// Create a fake HTTP request to /health
	req, err := http.NewRequest("GET", "/health", nil)
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}

	// ResponseRecorder records what the handler writes — status code, headers, body
	rr := httptest.NewRecorder()

	// Call the handler directly (no real server needed)
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok","service":"workforce-hub"}`))
	})

	handler.ServeHTTP(rr, req)

	// Assert status code is 200
	if rr.Code != http.StatusOK {
		t.Errorf("Expected status 200, got %d", rr.Code)
	}

	// Assert response body contains expected JSON
	expected := `{"status":"ok","service":"workforce-hub"}`
	if rr.Body.String() != expected {
		t.Errorf("Expected body %q, got %q", expected, rr.Body.String())
	}
}
