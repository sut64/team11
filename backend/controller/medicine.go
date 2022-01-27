package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sut64/team11/entity"
)

// Medicine
// GET /medicine/:id
func GetMedicine(c *gin.Context) {
	var medicine entity.Medicine
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM medicines WHERE id = ?", id).Scan(&medicine).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": medicine})
}

// GET /medicines
func ListMedicines(c *gin.Context) {
	var medicines []entity.Medicine
	if err := entity.DB().Raw("SELECT * FROM medicines").Scan(&medicines).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": medicines})
}

// DELETE /medicines/:id
func DeleteMedicine(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM medicines WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicine not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /medicines
func UpdateMedicine(c *gin.Context) {
	var medicine entity.Medicine
	if err := c.ShouldBindJSON(&medicine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", medicine.ID).First(&medicine); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicine not found"})
		return
	}

	if err := entity.DB().Save(&medicine).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": medicine})
}
