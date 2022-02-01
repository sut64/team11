package controller

import (
	"net/http"

    "github.com/gin-gonic/gin"
	"github.com/sut64/team11/entity"
	"github.com/asaskevich/govalidator"
)

// POST /patien
func CreatePatients(c *gin.Context) {

	var patient entity.Patient
	var patienttype entity.PatientType
	var gender entity.Gender
	var patientright entity.PatientRight

	// bind เข้าตัวแปร patient
	if err := c.ShouldBindJSON(&patient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// : ค้นหา patienttype ด้วย id
	if tx := entity.DB().Where("id = ?", patient.PatientTypeID).First(&patienttype); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "patienttype not found"})
		return
	}

	// : ค้นหา gender ด้วย id
	if tx := entity.DB().Where("id = ?", patient.GenderID).First(&gender); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Gender not found"})
		return
	}

	// : ค้นหา patientright ด้วย id
	if tx := entity.DB().Where("id = ?", patient.PatientRightID).First(&patientright); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "patientright not found"})
		return
	}

	// : สร้าง patient
	pt := entity.Patient{

		Gender:             gender,             // โยงความสัมพันธ์กับ Entity gender
		PatientType:      	patienttype,        // โยงความสัมพันธ์กับ Entity PatientType
		PatientRight:      	patientright,       // โยงความสัมพันธ์กับ Entity PatientRight
		HN: 				patient.HN,			// ตั่งค่าของ HN ให้เท่ากับค่าที่รับมา
		Pid:				patient.Pid,		// ตั่งค่าของ Pid ให้เท่ากับค่าที่รับมา
		FirstName:          patient.FirstName,  // ตั้งค่าฟิลด์ Firstname ให้เท่ากับค่าที่รับมา
		LastName:           patient.LastName,   // ตั้งค่าฟิลด์ Lastname ให้เท่ากับค่าที่รับมา
		Birthdate:          patient.Birthdate,  // ตั้งค่าฟิลด์ Birthdate ให้เท่ากับค่าที่รับมา
		Age:                patient.Age,        // ตั้งค่าฟิลด์ Age ให้เท่ากับค่าที่รับมา
		DateAdmit: 			patient.DateAdmit,  // ตั้งค่าฟิลด์ DateAdmit ให้เท่ากับค่าที่รับมา
		Symptom: 			patient.Symptom,    // ตั้งค่าฟิลด์ Symptom ให้เท่ากับค่าที่รับมา
	}

	// : ขั้นตอนการ validate ข้อมูล
	if _, err := govalidator.ValidateStruct(pt); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// : บันทึก
	if err := entity.DB().Create(&pt).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": pt})
}

// GET /patient/:id
func GetPatient(c *gin.Context) {
	var patient entity.Patient
	id := c.Param("id")
	if err := entity.DB().Preload("Gender").Preload("PatientType").Preload("PatientRight").Raw("SELECT * FROM patients WHERE id = ?", id).Find(&patient).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": patient})
}

// GET /patients
func ListPatients(c *gin.Context) {
	var patients []entity.Patient
	if err := entity.DB().Preload("Gender").Preload("PatientType").Preload("PatientRight").Raw("SELECT * FROM patients").Find(&patients).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": patients})
}

// DELETE /patient/:id
func DeletePatient(c *gin.Context) {
	id := c.Param("id")
	if tx := entity.DB().Exec("DELETE FROM patients WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "patient not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": id})
}

// PATCH /patient
func UpdatePatient(c *gin.Context) {
	var patient entity.Patient
	if err := c.ShouldBindJSON(&patient); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if tx := entity.DB().Where("id = ?", patient.ID).First(&patient); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "patient not found"})
		return
	}

	if err := entity.DB().Save(&patient).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": patient})
}