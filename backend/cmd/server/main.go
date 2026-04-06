package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	// Load .env file — godotenv reads key=value pairs into environment variables
	// This is how we keep secrets (DB password, JWT secret) out of source code
	if err := godotenv.Load("../../.env"); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// chi is a lightweight HTTP router for Go
	// It's compatible with net/http and supports middleware chaining
	r := chi.NewRouter()

	// Middleware stack — runs on every request in order
	r.Use(middleware.Logger)    // logs every request: method, path, status, duration
	r.Use(middleware.Recoverer) // catches panics and returns 500 instead of crashing server

	// CORS middleware — allows your React frontend (localhost:5173) to call this API
	// Without this, browsers block cross-origin requests by default
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})
	r.Use(c.Handler)

	// Health check endpoint — CI pipelines and load balancers use this
	// to verify the server is alive without hitting real business logic
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, `{"status":"ok","service":"workforce-hub"}`)
	})

	log.Println("🚀 Server running on http://localhost:8080")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}