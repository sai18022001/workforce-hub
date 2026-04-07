package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

type User struct {
	ent.Schema
}

func (User) Fields() []ent.Field {
	return []ent.Field{
		field.String("first_name").
			NotEmpty(),

		field.String("last_name").
			NotEmpty(),

		// Unique() adds a UNIQUE INDEX — no two users can share an email
		field.String("email").
			NotEmpty().
			Unique(),

		// Sensitive() tells EntGo to exclude this field from JSON marshaling
		// passwords should NEVER be returned in API responses
		field.String("password_hash").
			NotEmpty().
			Sensitive(),

		// Enum restricts the column to specific values at the DB level
		field.Enum("status").
			Values("active", "inactive", "on_leave").
			Default("active"),

		field.Time("created_at").
			Default(time.Now).
			Immutable(),

		field.Time("updated_at").
			Default(time.Now).
			UpdateDefault(time.Now), // UpdateDefault auto-updates this on every UPDATE query
	}
}

func (User) Edges() []ent.Edge {
	return []ent.Edge{
		// M2O = Many-to-One: many Users belong to one Role
		// From() means this side holds the foreign key (role_id column lives in users table)
		edge.From("role", Role.Type).
			Ref("users").
			Unique(), // Unique() here means each user has exactly one role

		// Many Users belong to one Department
		edge.From("department", Department.Type).
			Ref("users").
			Unique(),

		// One User has many ProjectAssignments
		edge.To("assignments", ProjectAssignment.Type),

		// One User has many Timesheets
		edge.To("timesheets", Timesheet.Type),
	}
}