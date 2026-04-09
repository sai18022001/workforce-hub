# ── Stage 1: Builder ──────────────────────────────────────────────────────────
# We use a multi-stage build — the builder stage has all Go tooling,
# the final stage has only the compiled binary. This keeps the image tiny.
FROM golang:1.26-alpine AS builder

# Install git (needed for some Go module downloads) and ca-certificates (for HTTPS)
RUN apk add --no-cache git ca-certificates

WORKDIR /app

# Copy dependency files first — Docker caches this layer
# so it only re-downloads modules when go.mod/go.sum change
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the source code
COPY . .

# Build a statically linked binary
# CGO_ENABLED=0 — disables C bindings, produces a self-contained binary
# GOOS=linux — cross-compile for Linux (we're building on Windows)
# -o workforce-hub — output binary name
RUN CGO_ENABLED=0 GOOS=linux go build -o workforce-hub ./cmd/server/main.go

# ── Stage 2: Final Image ──────────────────────────────────────────────────────
# Alpine is only ~5MB — keeps our final image under 20MB vs 300MB+ with golang base
FROM alpine:latest

RUN apk add --no-cache ca-certificates tzdata

WORKDIR /app

# Copy only the compiled binary from the builder stage
COPY --from=builder /app/workforce-hub .

EXPOSE 8080

CMD ["./workforce-hub"]