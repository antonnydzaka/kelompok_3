package controll

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"main.go/models"
)

const uploadDir = "uploads"

func init() {
	os.MkdirAll(uploadDir, 0755)
}

func HealthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok", "api": "running"})
}

func GetFruitsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		GetFruits(w, r, db)
	}
}

func AnalyzeFruitHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		AnalyzeFruit(w, r, db)
	}
}

func GetFruits(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	w.Header().Set("Content-Type", "application/json")

	rows, err := db.Query(`SELECT id, name, condition_status, status, confidence, image_path, created_at 
		FROM fruits ORDER BY created_at DESC LIMIT 20`)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}
	defer rows.Close()

	var fruits []models.Fruit
	for rows.Next() {
		var f models.Fruit
		var imgPath sql.NullString
		var createdAt interface{}
		if err := rows.Scan(&f.ID, &f.Name, &f.Condition, &f.Status, &f.Confidence, &imgPath, &createdAt); err != nil {
			continue
		}
		if imgPath.Valid && imgPath.String != "" {
			f.ImagePath = "/uploads/" + filepath.Base(imgPath.String)
		} else {
			f.ImagePath = "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=800&q=80"
		}
		if t, ok := createdAt.(time.Time); ok {
			f.Date = formatDate(t)
		} else {
			f.Date = "Baru saja"
		}
		f.StatusColor = getStatusColor(f.Status)
		fruits = append(fruits, f)
	}

	if fruits == nil {
		fruits = []models.Fruit{}
	}
	json.NewEncoder(w).Encode(fruits)
}

func AnalyzeFruit(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"error": "Method not allowed"})
		return
	}

	var imageData []byte
	var err error
	contentType := r.Header.Get("Content-Type")

	if strings.Contains(contentType, "multipart/form-data") {
		file, _, err := r.FormFile("image")
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Missing image: " + err.Error()})
			return
		}
		defer file.Close()
		imageData, err = io.ReadAll(file)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Failed to read image"})
			return
		}
	} else if strings.Contains(contentType, "application/json") {
		var req models.AnalyzeRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Invalid JSON"})
			return
		}
		if req.ImageBase64 == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Missing image base64"})
			return
		}
		parts := strings.SplitN(req.ImageBase64, ",", 2)
		if len(parts) == 2 {
			req.ImageBase64 = parts[1]
		}
		imageData, err = base64.StdEncoding.DecodeString(req.ImageBase64)
		if err != nil || len(imageData) == 0 {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "Invalid base64 image"})
			return
		}
	} else {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Content-Type must be multipart/form-data or application/json"})
		return
	}

	result := simulateAnalysis()

	filename := fmt.Sprintf("%d_%s.jpg", time.Now().UnixNano(), randomString(6))
	savePath := filepath.Join(uploadDir, filename)
	if err := os.WriteFile(savePath, imageData, 0644); err != nil {
		savePath = ""
	}
	relPath := savePath

	res, err := db.Exec(`INSERT INTO fruits (name, condition_status, status, confidence, description, image_path) 
		VALUES (?, ?, ?, ?, ?, ?)`,
		result.Name, result.Condition, result.Status, result.Confidence, result.Description, relPath)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database error: " + err.Error()})
		return
	}
	id, _ := res.LastInsertId()
	result.ID = int(id)

	json.NewEncoder(w).Encode(result)
}

func simulateAnalysis() models.AnalyzeResponse {
	results := []models.AnalyzeResponse{
		{Status: "Fresh", Confidence: 95 + rand.Intn(5), Name: "Buah Segar", Condition: "Sehat",
			Description: "Buah dalam kondisi sangat baik.", Color: "text-green-600", Bg: "bg-green-50", Border: "border-green-200", Icon: "bi-check-circle-fill"},
		{Status: "Rotten", Confidence: 80 + rand.Intn(15), Name: "Buah Busuk", Condition: "Busuk",
			Description: "Terdeteksi tanda pembusukan. Tidak disarankan dikonsumsi.", Color: "text-red-600", Bg: "bg-red-50", Border: "border-red-200", Icon: "bi-x-circle-fill"},
		{Status: "Ripe", Confidence: 88 + rand.Intn(10), Name: "Buah Matang", Condition: "Matang",
			Description: "Buah matang sempurna, siap dikonsumsi.", Color: "text-yellow-600", Bg: "bg-yellow-50", Border: "border-yellow-200", Icon: "bi-exclamation-circle-fill"},
	}
	return results[rand.Intn(len(results))]
}

func getStatusColor(status string) string {
	switch status {
	case "Fresh":
		return "bg-green-100 text-green-700 border-green-200"
	case "Rotten":
		return "bg-red-100 text-red-700 border-red-200"
	case "Ripe":
		return "bg-yellow-100 text-yellow-700 border-yellow-200"
	default:
		return "bg-gray-100 text-gray-700 border-gray-200"
	}
}

func formatDate(t time.Time) string {
	diff := time.Since(t)
	if diff < time.Minute {
		return "Baru saja"
	}
	if diff < time.Hour {
		return fmt.Sprintf("%d menit lalu", int(diff.Minutes()))
	}
	if diff < 24*time.Hour {
		return fmt.Sprintf("%d jam lalu", int(diff.Hours()))
	}
	if diff < 48*time.Hour {
		return "Kemarin"
	}
	return fmt.Sprintf("%d hari lalu", int(diff.Hours()/24))
}

func randomString(n int) string {
	const letters = "abcdefghijklmnopqrstuvwxyz0123456789"
	b := make([]byte, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}
