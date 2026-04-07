package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

type Department struct {
	ent.Schema
}

func (Department) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").
			NotEmpty().
			Unique(),

		field.String("description").
			Optional(),

		field.Time("created_at").
			Default(time.Now).
			Immutable(),
	}
}

func (Department) Edges() []ent.Edge {
	return []ent.Edge{
		// One Department has many Users
		edge.To("users", User.Type),
		// One Department has many Projects
		edge.To("projects", Project.Type),
	}
}