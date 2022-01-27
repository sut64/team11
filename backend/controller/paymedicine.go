package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sut64/team11/entity"
)

// POST /paymedicines
func CreatePayMedicine(c *gin.Context) {

	var employee entity.Employee
	var medicine entity.Medicine
	var patient entity.Patient
	var paymedicine entity.PayMedicine

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ จะถูก bind เข้าตัวแปร paymedicine
	if err := c.ShouldBindJSON(&paymedicine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// : ค้นหา patient ด้วย id
	if tx := entity.DB().Where("id = ?", paymedicine.PatientID).First(&patient); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "patient not found"})
		return
	}

	// : ค้นหา employee ด้วย id
	if tx := entity.DB().Where("id = ?", paymedicine.EmployeeID).First(&employee); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "employee not found"})
		return
	}

	// : ค้นหา medicine ด้วย id
	if tx := entity.DB().Where("id = ?", paymedicine.MedicineID).First(&medicine); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicine not found"})
		return
	}

	// : สร้าง PayMedicine
	pm := entity.PayMedicine{
		Patient:             patient,                         // โยงความสัมพันธ์กับ Entity Patient
		Employee:            employee,                        // โยงความสัมพันธ์กับ Entity Employee
		Medicine:            medicine,                        // โยงความสัมพันธ์กับ Entity Medicine
		Pid:                 paymedicine.Pid,                 // ตั้งค่าฟิลด์ Pid
		Prescription_number: paymedicine.Prescription_number, // ตั้งค่าฟิลด์ Prescription_number
		PayMedicineTime:     paymedicine.PayMedicineTime,     // ตั้งค่าฟิลด์ PayMedicineTime
	}

	// : บันทึก
	if err := entity.DB().Create(&pm).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": pm})
}

// GET /paymedicine/:id
func GetPayMedicine(c *gin.Context) {
	var paymedicine entity.PayMedicine
	id := c.Param("id")
	if err := entity.DB().Preload("Patient").Preload("Employee").Preload("Medicine").Raw("SELECT * FROM paymedicines WHERE id = ?", id).Find(&paymedicine).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": paymedicine})
}

// GET /paymedicines
func ListPayMedicines(c *gin.Context) {
	var paymedicines []entity.PayMedicine
	if err := entity.DB().Preload("Patient").Preload("Employee").Preload("Medicine").Raw("SELECT * FROM paymedicines").Find(&paymedicines).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": paymedicines})
}

// DELETE /paymedicines/:id
func DeletePayMedicine(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM paymedicines WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "paymedicine not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /paymedicines
func UpdatePayMedicine(c *gin.Context) {
	var paymedicine entity.PayMedicine
	if err := c.ShouldBindJSON(&paymedicine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", paymedicine.ID).First(&paymedicine); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "paymedicine not found"})
		return
	}

	if err := entity.DB().Save(&paymedicine).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": paymedicine})
}
