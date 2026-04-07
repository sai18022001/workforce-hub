package config

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/sai18022001/workforce-hub/backend/ent"

	// The underscore import registers the MySQL driver with database/sql
	// without this, Go doesn't know how to connect to MySQL
	_ "github.com/go-sql-driver/mysql"
)

// NewEntClient creates and returns an EntGo client connected to MySQL.
// It also runs AutoMigrate which creates/updates tables to match your schema.
func NewEntClient() *ent.Client {
	// Build the MySQL DSN (Data Source Name) from environment variables
	// Format: user:password@tcp(host:port)/database?params
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=True",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)

	// Open connection — this doesn't actually connect yet, just validates the DSN
	client, err := ent.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Failed to open database connection: %v", err)
	}

	// AutoMigrate reads your schema and creates/alters tables to match
	// It's safe to run on every startup — only makes additive changes
	// WARNING: It does NOT drop columns — use proper migrations for destructive changes
	if err := client.Schema.Create(context.Background()); err != nil {
		log.Fatalf("Failed to run database migrations: %v", err)
	}

	log.Println("✅ Database connected and migrations applied")
	return client
}
