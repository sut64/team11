package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sut64/team11/entity"
)

// GET /clinic/:id
func GetClicin(c *gin.Context) {
	var clinic entity.Clinic
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM clinics WHERE id = ?", id).Scan(&clinic).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": clinic})
}

// GET All /clinics
func ListClinics(c *gin.Context) {
	var clinics []entity.Clinic
	if err := entity.DB().Raw("SELECT * FROM clinics").Scan(&clinics).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": clinics})
}
