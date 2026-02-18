package controll

import (
	"fmt"
	"html/template"
	"net/http"
	"path/filepath"
)

func Home(w http.ResponseWriter,r *http.Request){
	fp := filepath.Join("view","home.html")
	t,err := template.ParseFiles(fp)
	if err != nil{
		fmt.Println(err.Error())
		return
	}
	t.Execute(w,nil)
}

func Add(w http.ResponseWriter,r *http.Request){
	fp := filepath.Join("view","addfood.html")
	t,err := template.ParseFiles(fp)
	if err != nil{
		fmt.Println(err.Error())
		return
	}
	t.Execute(w,nil)
}