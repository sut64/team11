package main

import (
	"github.com/gin-gonic/gin"
	"github.com/sut64/team11/controller"
	"github.com/sut64/team11/entity"
	"github.com/sut64/team11/middlewares"
)

func main() {
	entity.SetupDatabase()
	r := gin.Default()
	r.Use(CORSMiddleware())
	// User Routes
	api := r.Group("")
	{
		protected := api.Use(middlewares.Authorizes())
		{
			// user Routes
			protected.GET("/employees",controller.ListEmployees)
			protected.GET("/employee/:id",controller.GetEmployee)
			protected.PATCH("/emplotees",controller.UpdateEmployee)
			protected.DELETE("/emplotees/:id",controller.DeleteEmployee)

			// role Routes
			protected.GET("/roles",controller.ListRoles)
			protected.GET("/role/:id",controller.GetRole)

			// patient Routes
			protected.GET("/patients", controller.ListPatients)
			protected.GET("/patient/:id", controller.GetPatient)
			protected.POST("/patients", controller.CreatePatients)
			protected.PATCH("/patients", controller.UpdatePatient)
			protected.DELETE("/patients/:id", controller.DeletePatient)

			// patientType Routes
			protected.GET("/patienttypes", controller.ListPatientType)
			r.GET("/patienttype/:id", controller.GetPatientType)

			// patientRight Routes
			protected.GET("/patientrights", controller.ListPatientRights)
			r.GET("/patientright/:id", controller.GetPatientRight)

			// gender Routes
			protected.GET("/genders", controller.ListGenders)
			protected.GET("/gender/:id", controller.GetGender)
			
		}
	}
	// User Routes
	r.POST("/emplotees", controller.CreateEmployee)

	// Authentication Routes
	r.POST("/login", controller.Login)
	// Run the server
	r.Run()
}

func CORSMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {

		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}

}