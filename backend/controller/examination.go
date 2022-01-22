package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sut64/team11/entity"
)

// POST /examinations
func CreateExamiation(c *gin.Context) {

	var clinic entity.Clinic
	var disease entity.Disease
	var employee entity.Employee
	//var medicine entity.Medicine
	var patient entity.Patient
	var examination entity.Examination

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ จะถูก bind เข้าตัวแปร examination
	if err := c.ShouldBindJSON(&examination); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// : ค้นหา patient ด้วย id
	if tx := entity.DB().Where("id = ?", examination.PatientID).First(&patient); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "patient not found"})
		return
	}

	// : ค้นหา employee ด้วย id
	if tx := entity.DB().Where("id = ?", examination.EmployeeID).First(&employee); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "employee not found"})
		return
	}

	// : ค้นหา clinic ด้วย id
	if tx := entity.DB().Where("id = ?", examination.ClinicID).First(&clinic); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "clinic not found"})
		return
	}

	// : ค้นหา disease ด้วย id
	if tx := entity.DB().Where("id = ?", examination.DiseaseID).First(&disease); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "disease not found"})
		return
	}

	// : ค้นหา medicine ด้วย id
	/*if tx := entity.DB().Where("id = ?", examination.MedicineID).First(&medicine); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "medicine not found"})
		return
	}*/
	// : สร้าง Examination
	ex := entity.Examination{
		Patient:  patient,  // โยงความสัมพันธ์กับ Entity Patient
		Employee: employee, // โยงความสัมพันธ์กับ Entity Employee
		Clinic:   clinic,   // โยงความสัมพันธ์กับ Entity Clinic
		Disease:  disease,  // โยงความสัมพันธ์กับ Entity Disease
		//Medicine:      medicine,                  // โยงความสัมพันธ์กับ Entity Medicine
		ChiefComplaint: examination.ChiefComplaint, // ตั้งค่าฟิลด์ ChiefComplaint
		Treatment:      examination.Treatment,      // ตั้งค่าฟิลด์ Treatment
		Cost:           examination.Cost,           // ตั้งค่าฟิลด์ Cost
		DiagnosisTime:  examination.DiagnosisTime,  // ตั้งค่าฟิลด์ DiagnosisTime
	}

	// : บันทึก
	if err := entity.DB().Create(&ex).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": ex})
}

// GET /examination/:id
func GetExamination(c *gin.Context) {
	var examination entity.Examination
	id := c.Param("id")
	if err := entity.DB().Preload("Patient").Preload("Employee").Preload("Clinic").Preload("Disease").Preload("Medicine").Raw("SELECT * FROM examinations WHERE id = ?", id).Find(&examination).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": examination})
}

// GET /examinations
func ListExaminations(c *gin.Context) {
	var examinations []entity.Examination
	if err := entity.DB().Preload("Patient").Preload("Employee").Preload("Clinic").Preload("Disease").Preload("Medicine").Raw("SELECT * FROM examinations").Find(&examinations).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": examinations})
}

// DELETE /examinations/:id
func DeleteExamination(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM examinations WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "examination not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /examinations
func UpdateExamination(c *gin.Context) {
	var examination entity.Examination
	if err := c.ShouldBindJSON(&examination); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", examination.ID).First(&examination); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "examination not found"})
		return
	}

	if err := entity.DB().Save(&examination).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": examination})
}
