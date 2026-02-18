package models

import "time"

type Fruit struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Condition   string    `json:"condition"`
	Status      string    `json:"status"`
	Confidence  int       `json:"confidence"`
	ImagePath   string    `json:"image"`
	StatusColor string    `json:"statusColor,omitempty"`
	Date        string    `json:"date"`
	CreatedAt   time.Time `json:"created_at"`
}

type AnalyzeRequest struct {
	ImageBase64 string `json:"image,omitempty"`
}

type AnalyzeResponse struct {
	ID          int    `json:"id"`
	Status      string `json:"status"`
	Confidence  int    `json:"confidence"`
	Description string `json:"description"`
	Name        string `json:"name"`
	Condition   string `json:"condition"`
	Color       string `json:"color"`
	Bg          string `json:"bg"`
	Border      string `json:"border"`
	Icon        string `json:"icon"`
}
