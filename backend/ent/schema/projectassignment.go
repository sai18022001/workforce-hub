package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

type ProjectAssignment struct {
	ent.Schema
}

func (ProjectAssignment) Fields() []ent.Field {
	return []ent.Field{
		// Role this user plays on this specific project
		field.Enum("project_role").
			Values("lead", "developer", "designer", "tester", "analyst").
			Default("developer"),

		// Allocated hours for this user on this project
		field.Float("allocated_hours").
			Default(0),

		field.Time("assigned_at").
			Default(time.Now).
			Immutable(),
	}
}

func (ProjectAssignment) Edges() []ent.Edge {
	return []ent.Edge{
		// M2O back to User — each assignment belongs to one user
		edge.From("user", User.Type).
			Ref("assignments").
			Unique().
			Required(), // Required() means user_id column is NOT NULL

		// M2O back to Project — each assignment belongs to one project
		edge.From("project", Project.Type).
			Ref("assignments").
			Unique().
			Required(),
	}
}