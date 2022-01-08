package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sut64/team11/entity"
)

// GET /PatientType/:id
func GetPatientType(c *gin.Context) {
	var patienttype entity.PatientType
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM patient_types WHERE id = ?", id).Scan(&patienttype).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": patienttype})
}

// GET All /PatientTypes
func ListPatientType(c *gin.Context) {
	var patienttypes []entity.PatientType
	if err := entity.DB().Raw("SELECT * FROM patient_types").Scan(&patienttypes).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": patienttypes})
}