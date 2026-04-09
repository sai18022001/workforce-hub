import { gql } from '@apollo/client'

// ── AUTH ──────────────────────────────────────────────────────────────────────

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        firstName
        lastName
        email
        status
      }
    }
  }
`

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`

// ── DASHBOARD ─────────────────────────────────────────────────────────────────

export const DASHBOARD_STATS_QUERY = gql`
  query DashboardStats {
    dashboardStats {
      totalUsers
      totalProjects
      activeProjects
      totalHoursLogged
    }
  }
`

// ── USERS ─────────────────────────────────────────────────────────────────────

export const USERS_QUERY = gql`
  query Users {
    users {
      id
      firstName
      lastName
      email
      status
      role {
        name
      }
      department {
        name
      }
    }
  }
`

// ── DEPARTMENTS ───────────────────────────────────────────────────────────────

export const DEPARTMENTS_QUERY = gql`
  query Departments {
    departments {
      id
      name
      description
      users {
        id
      }
      projects {
        id
      }
    }
  }
`

export const CREATE_DEPARTMENT_MUTATION = gql`
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) {
      id
      name
      description
    }
  }
`

// ── ROLES ─────────────────────────────────────────────────────────────────────

export const ROLES_QUERY = gql`
  query Roles {
    roles {
      id
      name
    }
  }
`

// ── PROJECTS ──────────────────────────────────────────────────────────────────

export const PROJECTS_QUERY = gql`
  query Projects {
    projects {
      id
      name
      description
      status
      startDate
      endDate
      department {
        name
      }
      assignments {
        id
      }
    }
  }
`

export const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
      status
    }
  }
`

export const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      name
      status
    }
  }
`

export const DELETE_PROJECT_MUTATION = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`

// ── TIMESHEETS ────────────────────────────────────────────────────────────────

export const TIMESHEETS_QUERY = gql`
  query Timesheets($userId: ID!) {
    timesheets(userId: $userId) {
      id
      date
      hoursWorked
      description
      status
      project {
        name
      }
    }
  }
`

export const LOG_TIMESHEET_MUTATION = gql`
  mutation LogTimesheet($input: LogTimesheetInput!) {
    logTimesheet(input: $input) {
      id
      date
      hoursWorked
      status
    }
  }
`

export const PENDING_TIMESHEETS_QUERY = gql`
  query PendingTimesheets {
    pendingTimesheets {
      id
      date
      hoursWorked
      status
      user {
        firstName
        lastName
      }
      project {
        name
      }
    }
  }
`