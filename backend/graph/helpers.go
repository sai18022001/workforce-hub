package graph

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/sai18022001/workforce-hub/backend/ent"
	"github.com/sai18022001/workforce-hub/backend/graph/model"
)

func generateJWT(userID int) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
		"iat":     time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", fmt.Errorf("failed to sign JWT: %w", err)
	}
	return signed, nil
}

func entUserToModel(u *ent.User) *model.User {
	status := model.UserStatus(u.Status)
	return &model.User{
		ID:        strconv.Itoa(u.ID),
		FirstName: u.FirstName,
		LastName:  u.LastName,
		Email:     u.Email,
		Status:    status,
		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
	}
}

func entDepartmentToModel(d *ent.Department) *model.Department {
	desc := d.Description
	return &model.Department{
		ID:          strconv.Itoa(d.ID),
		Name:        d.Name,
		Description: &desc,
		CreatedAt:   d.CreatedAt,
	}
}

func entRoleToModel(r *ent.Role) *model.Role {
	desc := r.Description
	return &model.Role{
		ID:          strconv.Itoa(r.ID),
		Name:        r.Name,
		Description: &desc,
		CreatedAt:   r.CreatedAt,
	}
}

func entProjectToModel(p *ent.Project) *model.Project {
	status := model.ProjectStatus(p.Status)
	desc := p.Description
	return &model.Project{
		ID:          strconv.Itoa(p.ID),
		Name:        p.Name,
		Description: &desc,
		Status:      status,
		StartDate:   p.StartDate,
		EndDate:     p.EndDate,
		CreatedAt:   p.CreatedAt,
		UpdatedAt:   p.UpdatedAt,
	}
}

func entAssignmentToModel(a *ent.ProjectAssignment) *model.ProjectAssignment {
	return &model.ProjectAssignment{
		ID:             strconv.Itoa(a.ID),
		ProjectRole:    model.ProjectRole(a.ProjectRole),
		AllocatedHours: a.AllocatedHours,
		AssignedAt:     a.AssignedAt,
	}
}

func entTimesheetToModel(t *ent.Timesheet) *model.Timesheet {
	desc := t.Description
	return &model.Timesheet{
		ID:          strconv.Itoa(t.ID),
		Date:        t.Date,
		HoursWorked: t.HoursWorked,
		Description: &desc,
		Status:      model.TimesheetStatus(t.Status),
		CreatedAt:   t.CreatedAt,
		UpdatedAt:   t.UpdatedAt,
	}
}