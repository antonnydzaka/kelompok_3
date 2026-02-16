package help

import "net/http"

func NewHelloWord()(func(w http.ResponseWriter, r *http.Request)){
	return  func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("hello word"))
	}
}