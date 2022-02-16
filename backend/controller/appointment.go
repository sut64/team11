package controller

import (
	"net/http"

	"github.com/asaskevich/govalidator"
	"github.com/gin-gonic/gin"
	"github.com/sut64/team11/entity"
)

// POST /appointment
func CreateAppointment(c *gin.Context) {

	var appointment entity.Appointment
	var patient entity.Patient
	var clinic entity.Clinic
	var employee entity.Employee

	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 8 จะถูก bind เข้าตัวแปร appointment
	if err := c.ShouldBindJSON(&appointment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// 9: ค้นหา patient ด้วย id
	if tx := entity.DB().Where("id = ?", appointment.PatientID).First(&patient); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "patient not found"})
		return
	}

	// 10: ค้นหา employee ด้วย id
	if tx := entity.DB().Where("id = ?", appointment.EmployeeID).First(&employee); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "doctor not found"})
		return
	}

	// 11: ค้นหา clinic ด้วย id
	if tx := entity.DB().Where("id = ?", appointment.ClinicID).First(&clinic); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "clinic not found"})
		return
	}
	// 12: สร้าง Appointment
	apm := entity.Appointment{
		Patient:         patient,                     // โยงความสัมพันธ์กับ Entity Patient
		Employee:        employee,                    // โยงความสัมพันธ์กับ Entity Employee
		Clinic:          clinic,                      // โยงความสัมพันธ์กับ Entity Clinic
		RoomNumber:      appointment.RoomNumber,      // ตั้งค่าฟิลด์ roomnumber
		AppointmentTime: appointment.AppointmentTime, // ตั้งค่าฟิลด์ appointmentTime
		Note:            appointment.Note,            // ตั้งค่าฟิลด์ note
	}

	//ขั้นตอนการ validate ที่นำมาจาก  unit test
	if _, err := govalidator.ValidateStruct(apm); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 13: บันทึก
	if err := entity.DB().Create(&apm).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": apm})
}

// GET /appointment/:id
func GetAppointment(c *gin.Context) {
	var appointment entity.Appointment
	id := c.Param("id")
	if err := entity.DB().Preload("Patient").Preload("Employee").Preload("Clinic").Raw("SELECT * FROM appointments WHERE id = ?", id).Find(&appointment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": appointment})
}

// GET /appointment
func ListAppointments(c *gin.Context) {
	var appointments []entity.Appointment
	if err := entity.DB().Preload("Patient").Preload("Employee").Preload("Clinic").Raw("SELECT * FROM appointments").Find(&appointments).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": appointments})
}

// DELETE /appointments/:id
func DeleteAppointment(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM appointments WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "appointment not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /appointments
func UpdateAppointment(c *gin.Context) {
	var appointment entity.Appointment
	if err := c.ShouldBindJSON(&appointment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", appointment.ID).First(&appointment); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "appointment not found"})
		return
	}

	if err := entity.DB().Save(&appointment).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": appointment})
}
