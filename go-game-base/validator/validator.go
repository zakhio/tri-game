package validator

type Validator interface {
	HasPermission(string) bool
	Permit(string, bool)
	Reset()
}
