package models

type MessageA struct {
	ID             int     `json:"id"`
	Secuencia      string  `json:"secuencia"`
	FechaCarga     string  `json:"fechaCarga"`
	Modulo         string  `json:"modulo"`
	Iniciado       bool    `json:"iniciado"`
	Finalizado     bool    `json:"finalizado"`
	Error          bool    `json:"error"`
	HoraIniciado   string  `json:"horaIniciado"`
	HoraFinalizado *string `json:"horaFinalizado"` // Usamos puntero para permitir null
	Reproceso      bool    `json:"reproceso"`
	Mensaje        string  `json:"mensaje"`
}
