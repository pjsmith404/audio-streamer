package main

import (
	"fmt"
	"net/http"
	"log"
)

func main() {
	fmt.Println("Hello world")
	mux := http.NewServeMux()

	mux.Handle("/{$}", http.RedirectHandler("/app/", 301))

	appHandler := http.StripPrefix("/app/", http.FileServer(http.Dir("./app")))
	mux.Handle("/app/", appHandler)

	contentHandler := http.StripPrefix("/content/", http.FileServer(http.Dir("./content")))
	mux.Handle("/content/", contentHandler)

	s := &http.Server{
		Addr: ":8080",
		Handler: mux,
	}

	log.Fatal(s.ListenAndServe())
}
