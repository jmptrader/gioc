package models

type MessageC struct {
	ID               int    `json:"id"`
	Secuencia        string `json:"secuencia"`
	Modulo           string `json:"modulo"`
	NombreMovimiento string `json:"nombreMovimiento"`
	AccountNumber    string `json:"accountNumber"`
	Error            bool   `json:"error"`
	Consistencia     bool   `json:"consistencia"`
	Mensaje          string `json:"mensaje"`
}
