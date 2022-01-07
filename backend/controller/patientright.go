package controller

import (
	"net/http"

	"github.com/sut64/team11/entity"
	"github.com/gin-gonic/gin"
)


// GET /patientright/:id
func GetPatientRight(c *gin.Context) {
	var patientright entity.PatientRight
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM patient_rights WHERE id = ?", id).Scan(&patientright).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": patientright})
}

// GET /patientrights
func ListPatientRights(c *gin.Context) {
	var patientrights []entity.PatientRight
	if err := entity.DB().Raw("SELECT * FROM patient_rights").Scan(&patientrights).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": patientrights})
}

// DELETE /patientrights/:id
func DeletePatientRight(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM patient_rights WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "patientright not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /patientrights
func UpdatePatientRight(c *gin.Context) {
	var patientright entity.PatientRight
	if err := c.ShouldBindJSON(&patientright); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", patientright.ID).First(&patientright); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "patientright not found"})
		return
	}

	if err := entity.DB().Save(&patientright).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data":patientright})
}