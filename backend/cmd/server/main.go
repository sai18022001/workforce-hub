package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"github.com/sai18022001/workforce-hub/backend/config"
	"github.com/sai18022001/workforce-hub/backend/graph"
	"github.com/sai18022001/workforce-hub/backend/graph/generated"
)

func main() {
	// Load .env
	for _, path := range []string{".env", "../.env", "../../.env"} {
		if err := godotenv.Load(path); err == nil {
			log.Println("Loaded .env from:", path)
			break
		}
	}

	// Connect to DB and run migrations
	dbClient := config.NewEntClient()
	defer dbClient.Close()

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})
	r.Use(c.Handler)

	// Health check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, `{"status":"ok","service":"workforce-hub"}`)
	})

	// GraphQL handler — processes all GraphQL queries and mutations
	// handler.NewDefaultServer sets up tracing, error handling, complexity limits
	srv := handler.NewDefaultServer(
		generated.NewExecutableSchema(
			generated.Config{
				Resolvers: &graph.Resolver{DB: dbClient},
			},
		),
	)

	// GraphQL Playground — interactive browser IDE for testing queries
	// Available at http://localhost:8080/ in development
	r.Handle("/", playground.Handler("Workforce Hub GraphQL", "/query"))

	// All GraphQL operations go through this single endpoint
	// This is the URL your React Apollo Client will point to
	r.Handle("/query", srv)

	log.Println("🚀 Server running on http://localhost:8080")
	log.Println("🎮 GraphQL Playground at http://localhost:8080/")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
