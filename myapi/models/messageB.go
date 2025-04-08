package models

type MessageB struct {
	ID                int    `json:"id"`
	Secuencia         string `json:"secuencia"`
	Modulo            string `json:"modulo"`
	NombreProducto    string `json:"nombreProducto"`
	NombreTransaccion string `json:"nombreTransaccion"`
	NroRegistros      int    `json:"nroRegistros"`
	Error             bool   `json:"error"`
}
