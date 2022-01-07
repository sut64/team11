package controller

import (
	"net/http"

	"github.com/sut64/team11/entity"
	"github.com/gin-gonic/gin"
)


// GET /patientright/:id
func GetPayType(c *gin.Context) {
	var paytype entity.PayType
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM pay_types WHERE id = ?", id).Scan(&paytype).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data":paytype})
}

// GET /patientrights
func ListPayTypes(c *gin.Context) {
	var paytypes []entity.PayType
	if err := entity.DB().Raw("SELECT * FROM pay_types").Scan(&paytypes).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": paytypes})
}
