package controller

import (
	"net/http"

    "github.com/gin-gonic/gin"
	"github.com/sut64/team11/entity"
)

// POST /cliniclogs
func CreateClinicLogs(c *gin.Context) {

	var cliniclog entity.ClinicLog
	var clinic entity.Clinic
	var employee entity.Employee
	var patient entity.Patient

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ จะถูก bind เข้าตัวแปร cliniclog
	if err := c.ShouldBindJSON(&cliniclog); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// : ค้นหา clinic ด้วย id
	if tx := entity.DB().Where("id = ?", cliniclog.ClinicID).First(&clinic); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "clinic not found"})
		return
	}

	// : ค้นหา patient ด้วย id
	if tx := entity.DB().Where("id = ?", cliniclog.PatientID).First(&patient); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "patient not found"})
		return
	}

	// : ค้นหา recorder ด้วย id
	if tx := entity.DB().Where("id = ?", cliniclog.EmployeeID).First(&employee); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Recorder not found"})
		return
	}

	// : สร้าง cliniclog
	cl := entity.ClinicLog{

		Clinic:             clinic,             	// โยงความสัมพันธ์กับ Entity Clinic
		Patient:      		patient,        		// โยงความสัมพันธ์กับ Entity Patient
		//Recorder:      	recorder,      			// โยงความสัมพันธ์กับ Entity Recorder
		ClinicRoom: 		cliniclog.ClinicRoom,	// ตั่งค่าของ ClinicRoom ให้เท่ากับค่าที่รับมา
		Note:				cliniclog.Note,			// ตั่งค่าของ Note ให้เท่ากับค่าที่รับมา
		SendingTime: 		cliniclog.SendingTime,  // ตั้งค่าฟิลด์ SendingTime ให้เท่ากับค่าที่รับมา
	}

	// 15: บันทึก
	if err := entity.DB().Create(&cl).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": cl})
}

// GET /cliniclog/:id
func GetClinicLog(c *gin.Context) {
	var cliniclog entity.ClinicLog
	id := c.Param("id")
	if err := entity.DB().Preload("Clinic").Preload("Patient").Raw("SELECT * FROM cliniclogs WHERE id = ?", id).Find(&cliniclog).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": cliniclog})
}

// GET /cliniclogs
func ListCliniclogs(c *gin.Context) {
	var cliniclogs []entity.ClinicLog
	if err := entity.DB().Preload("Clinic").Preload("Patient").Raw("SELECT * FROM cliniclogs").Find(&cliniclogs).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": cliniclogs})
}

// DELETE /cliniclog/:id
func DeleteClinicLog(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM cliniclogs WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cliniclog not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /cliniclog
func UpdateClinicLog(c *gin.Context) {
	var cliniclog entity.ClinicLog
	if err := c.ShouldBindJSON(&cliniclog); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", cliniclog.ID).First(&cliniclog); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "cliniclog not found"})
		return
	}

	if err := entity.DB().Save(&cliniclog).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": cliniclog})
}