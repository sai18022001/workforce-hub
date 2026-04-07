package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Role holds the schema definition for the Role entity.
// In EntGo, each schema becomes a database table.
type Role struct {
	ent.Schema
}

// Fields defines the columns of the roles table.
func (Role) Fields() []ent.Field {
	return []ent.Field{
		// field.String creates a VARCHAR column
		// NotEmpty() adds a NOT NULL + CHECK constraint
		field.String("name").
			NotEmpty().
			Unique(), // role names must be unique (admin, manager, employee)

		field.String("description").
			Optional(), // Optional() means nullable column — description can be empty

		// Default() sets the column default value in SQL
		field.Time("created_at").
			Default(time.Now).
			Immutable(), // Immutable() means EntGo won't generate an Update method for this field
	}
}

// Edges defines relationships to other entities.
// In EntGo, edges become foreign keys and JOIN queries.
func (Role) Edges() []ent.Edge {
	return []ent.Edge{
		// O2M = One-to-Many: one Role has many Users
		// "users" is the edge name — EntGo generates role.QueryUsers() from this
		edge.To("users", User.Type),
	}
}