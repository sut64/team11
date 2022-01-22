package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sut64/team11/entity"
	"golang.org/x/crypto/bcrypt"
)

// GET /Employees
// List all Employees
func ListEmployees(c *gin.Context) {
	var Employees []entity.Employee
	if err := entity.DB().Preload("Role").Raw("SELECT * FROM employees").Find(&Employees).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": Employees})
}

// GET /Employee/:id
// Get Employee by id
func GetEmployee(c *gin.Context) {
	var Employee entity.Employee
	id := c.Param("id")
	if err := entity.DB().Preload("Role").Raw("SELECT * FROM employees WHERE id = ?", id).Find(&Employee).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": Employee})
}

// POST /Employees
func CreateEmployee(c *gin.Context) {
	var Employee entity.Employee
	if err := c.ShouldBindJSON(&Employee); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// เข้ารหัสลับรหัสผ่านที่ผู้ใช้กรอกก่อนบันทึกลงฐานข้อมูล
	bytes, err := bcrypt.GenerateFromPassword([]byte(Employee.Password), 14)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error hashing password"})
		return
	}
	Employee.Password = string(bytes)

	if err := entity.DB().Create(&Employee).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": Employee})
}

// PATCH /Employees
func UpdateEmployee(c *gin.Context) {
	var Employee entity.Employee
	if err := c.ShouldBindJSON(&Employee); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", Employee.ID).First(&Employee); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Employee not found"})
		return
	}

	if err := entity.DB().Save(&Employee).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": Employee})
}

// DELETE /Employees/:id
func DeleteEmployee(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM Employees WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Employee not found"})
		return
	}
	/*
		if err := entity.DB().Where("id = ?", id).Delete(&entity.Employee{}).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}*/

	c.JSON(http.StatusOK, gin.H{"data": id})
}
