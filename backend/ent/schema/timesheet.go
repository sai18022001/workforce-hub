package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

type Timesheet struct {
	ent.Schema
}

func (Timesheet) Fields() []ent.Field {
	return []ent.Field{
		// The date this timesheet entry is for
		field.Time("date"),

		// Hours worked — validated between 0 and 24
		field.Float("hours_worked").
			Positive(), // Positive() adds a CHECK constraint: hours_worked > 0

		field.String("description").
			Optional(),

		field.Enum("status").
			Values("draft", "submitted", "approved", "rejected").
			Default("draft"),

		field.Time("created_at").
			Default(time.Now).
			Immutable(),

		field.Time("updated_at").
			Default(time.Now).
			UpdateDefault(time.Now),
	}
}

func (Timesheet) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).
			Ref("timesheets").
			Unique().
			Required(),

		edge.From("project", Project.Type).
			Ref("timesheets").
			Unique().
			Required(),
	}
}