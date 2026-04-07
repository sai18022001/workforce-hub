package graph

import "github.com/sai18022001/workforce-hub/backend/ent"

// Resolver is the root resolver holding shared dependencies.
// gqlgen generates the interface definitions — we just implement them here.
type Resolver struct {
	DB *ent.Client
}
