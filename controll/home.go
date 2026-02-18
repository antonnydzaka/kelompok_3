package controll

import (
	"net/http"
)

func Home(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "http://localhost:5173", http.StatusSeeOther)
}

func Add(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "http://localhost:5173/add", http.StatusSeeOther)
}
