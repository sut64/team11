package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sut64/team11/entity"
)

// GET /role/:id
func GetRole(c *gin.Context) {
	var role entity.Role
	id := c.Param("id")
	if err := entity.DB().Raw("SELECT * FROM roles WHERE id = ?", id).Scan(&role).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": role})
}

// GET All /roles
func ListRoles(c *gin.Context) {
	var roles []entity.Role
	if err := entity.DB().Raw("SELECT * FROM roles").Scan(&roles).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": roles})
}
