package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sut64/team11/entity"
)

// POST /clinics
func CreateClinics(c *gin.Context) {
	var clinic entity.Clinic
	if err := c.ShouldBindJSON(&clinic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := entity.DB().Create(&clinic).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": clinic})
}

// GET /clinic/:id
func GetClinic(c *gin.Context) {
	var clinic entity.Clinic
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM clinics WHERE id = ?", id).Scan(&clinic).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": clinic})
}

// GET /clinics
func ListClinics(c *gin.Context) {
	var clinics []entity.Clinic
	if err := entity.DB().Raw("SELECT * FROM clinics").Scan(&clinics).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": clinics})
}

// DELETE /clinics/:id
func DeleteClinics(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM clinics WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "clinic not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /clinics
func UpdateClinic(c *gin.Context) {
	var clinic entity.Clinic
	if err := c.ShouldBindJSON(&clinic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", clinic.ID).First(&clinic); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "clinic not found"})
		return
	}

	if err := entity.DB().Save(&clinic).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": clinic})
}
