package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sut64/team11/entity"
)

// GET /billitem/:id
func GetBillItem(c *gin.Context) {
	var billitem entity.BillItem
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM bill_items WHERE bill_id = ?", id).Scan(&billitem).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data":billitem})
}

// GET /billitems
func ListBillItem(c *gin.Context) {
	var billitems []entity.BillItem
	if err := entity.DB().Raw("SELECT * FROM bill_items").Scan(&billitems).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": billitems})
}
