package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

type Project struct {
	ent.Schema
}

func (Project) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").
			NotEmpty(),

		field.String("description").
			Optional(),

		field.Enum("status").
			Values("planning", "active", "on_hold", "completed", "cancelled").
			Default("planning"),

		// Time fields for project timeline
		field.Time("start_date").
			Optional().
			Nillable(), // Nillable() generates a *time.Time pointer — can be nil in Go

		field.Time("end_date").
			Optional().
			Nillable(),

		field.Time("created_at").
			Default(time.Now).
			Immutable(),

		field.Time("updated_at").
			Default(time.Now).
			UpdateDefault(time.Now),
	}
}

func (Project) Edges() []ent.Edge {
	return []ent.Edge{
		// Many Projects belong to one Department
		edge.From("department", Department.Type).
			Ref("projects").
			Unique(),

		// One Project has many Assignments
		edge.To("assignments", ProjectAssignment.Type),

		// One Project has many Timesheets
		edge.To("timesheets", Timesheet.Type),
	}
}