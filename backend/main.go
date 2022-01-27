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
			protected.GET("/employees", controller.ListEmployees)
			protected.GET("/employee/:id", controller.GetEmployee)
			protected.GET("/employeerole/:roleid", controller.GetEmployeerole)
			protected.PATCH("/emplotees", controller.UpdateEmployee)
			protected.DELETE("/emplotees/:id", controller.DeleteEmployee)

			// role Routes
			protected.GET("/roles", controller.ListRoles)
			protected.GET("/role/:id", controller.GetRole)

			// patient Routes
			protected.GET("/patients", controller.ListPatients)
			protected.GET("/patient/:id", controller.GetPatient)
			protected.POST("/patients", controller.CreatePatients)
			protected.PATCH("/patients", controller.UpdatePatient)
			protected.DELETE("/patients/:id", controller.DeletePatient)

			// patientType Routes
			protected.GET("/patienttypes", controller.ListPatientType)
			protected.GET("/patienttype/:id", controller.GetPatientType)

			// patientRight Routes
			protected.GET("/patientrights", controller.ListPatientRights)
			protected.GET("/patientright/:id", controller.GetPatientRight)

			//Paytype Routes 
			protected.GET("/paytypes", controller.ListPayTypes)
			protected.GET("/paytype/:id", controller.GetPayType)

			// gender Routes
			protected.GET("/genders", controller.ListGenders)
			protected.GET("/gender/:id", controller.GetGender)

			// Appointment Routes
			protected.GET("/appointments", controller.ListAppointments)
			protected.GET("/appointment/:id", controller.GetAppointment)
			protected.POST("/appointments", controller.CreateAppointment)
			protected.PATCH("/appointments", controller.UpdateAppointment)
			protected.DELETE("/appointments/:id", controller.DeleteAppointment)

			// Clinic Routes
			protected.GET("/clinics", controller.ListClinics)
			protected.GET("/clinic/:id", controller.GetClinic)
			protected.POST("/clinics", controller.CreateClinics)
			protected.PATCH("/clinics", controller.UpdateClinic)
			protected.DELETE("/clinics/:id", controller.DeleteClinics)

			// Disease Routes
			protected.GET("/diseases", controller.ListDiseases)
			protected.GET("/disease/:id", controller.GetDisease)

			// Examination Routes
			protected.GET("/examinations", controller.ListExaminations)
			protected.GET("/examination/:id", controller.GetExamination)
			protected.POST("/examinations", controller.CreateExamination)
			protected.PATCH("/examinations", controller.UpdateExamination)
			protected.DELETE("/examinations/:id", controller.DeleteExamination)

			// ClinicLog Routes
			protected.GET("/cliniclogs", controller.ListCliniclogs)
			protected.GET("/cliniclog/:id", controller.GetClinicLog)
			protected.POST("/cliniclogs", controller.CreateClinicLogs)
			protected.PATCH("/cliniclogs", controller.UpdateClinicLog)
			protected.DELETE("/cliniclogs/:id", controller.DeleteClinicLog)
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
