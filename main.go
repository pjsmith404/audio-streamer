package main

import (
	"fmt"
	"net/http"
	"log"
	"os"
)

func main() {
	contentPath := os.Getenv("CONTENT_PATH")
	if contentPath == "" {
		log.Fatal("CONTENT_PATH not set")
	}

	mux := http.NewServeMux()

	mux.Handle("/{$}", http.RedirectHandler("/app/", 301))

	appHandler := http.StripPrefix("/app/", http.FileServer(http.Dir("./app")))
	mux.Handle("/app/", appHandler)

	contentHandler := http.StripPrefix("/content/", http.FileServer(http.Dir(contentPath)))
	mux.Handle("/content/", noCacheMiddleware(contentHandler))

	s := &http.Server{
		Addr: "0.0.0.0:8080",
		Handler: mux,
	}

	fmt.Println("Starting server...")
	log.Fatal(s.ListenAndServe())
}
