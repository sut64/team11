package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sut64/team11/entity"

	"github.com/asaskevich/govalidator"
)

// POST /bills
func CreateBill(c *gin.Context) {

	var paytype entity.PayType
	var patientright entity.PatientRight
	var employee entity.Employee
	var bill entity.Bill
	var total uint
	
	
	// ผลลัพธ์ที่ได้จากขั้นตอนที่ 8 จะถูก bind เข้าตัวแปร bill
	if err := c.ShouldBindJSON(&bill); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	

	// 10: ค้นหา patientright ด้วย id
	if tx := entity.DB().Where("id = ?", bill.PatientRightID).First(&patientright); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "patientright not found"})
		return
	}

	// 10: ค้นหา paytype ด้วย id
	if tx := entity.DB().Where("id = ?", bill.PayTypeID).First(&paytype); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "paytype not found"})
		return
	}

	// 11: ค้นหา employee ด้วย id
	if tx := entity.DB().Where("id = ?", bill.EmployeeID).First(&employee); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "employee not found"})
		return
	}

	entity.DB().Joins("Role").Find(&employee)

	if employee.Role.Position != "Cashier" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "The data recorder should be a Cashier !!"})
		return
	}

		
	// 12: สร้าง Bill
	bl := entity.Bill{       
		PatientRight:    patientright,        // โยงความสัมพันธ์กับ Entity PatientRight
		PayType : paytype,                   // โยงความสัมพันธ์ Entity Paytype
		Employee:    employee,               // โยงความสัมพันธ์กับ Entity Employee
		BillTime: bill.BillTime, 			// ตั้งค่าฟิลด์ BillTime
		Total: bill.Total - patientright.Discount,  //ตั้งค่าฟิลด์ Total
		Telephone : bill.Telephone,			 //ตั้งค่าฟิลด์ Telephone
	}

	// แทรกการ validate ไว้ช่วงนี้ของ controller
	if _, err := govalidator.ValidateStruct(bill); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	for _,item := range bill.BillItems{

		var exams entity.Examination

		if tx := entity.DB().Where("id = ?", item.ExaminationID).First(&exams); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "examination not found"})
			return
		}

		entity.DB().Joins("Medicine").Find(&exams)

		total += (uint(exams.Cost) + exams.Medicine.Cost);


	}

	//ตรวจสอบฟิลด์ว่ามีค่าตรงกันกับ ค่าใช้จ่ายทั้งหมดหรือไหม

	if bill.Total != total {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Total input not match !!"})
		return
	}
	

	// 13: บันทึก bill
	if err := entity.DB().Create(&bl).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	
	var items []entity.BillItem

	for _,item := range bill.BillItems{

		var exams entity.Examination

		if tx := entity.DB().Where("id = ?", item.ExaminationID).First(&exams); tx.RowsAffected == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "examination not found"})
			return
		}

		i := entity.BillItem{

			Bill : bl,

			Examination : exams,

		}

		items = append(items, i)
	}

	//บันทึก billitem
	if err := entity.DB().Create(&items).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	entity.DB().Preload("BillItems").Preload("BillItems.Examination").Raw("SELECT * FROM bills WHERE id = ?", bl.ID).Find(&bl)

	c.JSON(http.StatusOK, gin.H{"data": bl})


	
}
// GET /bill/:id
func GetBill(c *gin.Context) {
	var bill entity.Bill
	id := c.Param("id")
	if err := entity.DB().Preload("BillItems").Preload("BillItems.Examination").Preload("BillItems.Examination.Medicine").Preload("PatientRight").Preload("PayType").Preload("Employee").Raw("SELECT * FROM bills WHERE id = ?", id).Find(&bill).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": bill})
}

// GET /bills
func ListBills(c *gin.Context) {
	var bills []entity.Bill
	if err := entity.DB().Preload("BillItems").Preload("BillItems.Examination").Preload("BillItems.Examination.Medicine").Preload("BillItems.Examination.Patient").Preload("PatientRight").Preload("PayType").Preload("Employee").Raw("SELECT * FROM bills").Find(&bills).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bills})
}

// DELETE /bill/:id
func DeleteBill(c *gin.Context) {
	id := c.Param("id")
	var bills []entity.Bill

	if tx := entity.DB().Exec("DELETE FROM bills WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bill not found"})
		return
	}

	if tx := entity.DB().Exec("DELETE FROM bill_items WHERE bill_id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "examination not found"})
		return
	}

	if err := entity.DB().Preload("BillItems").Preload("BillItems.Examination").Preload("BillItems.Examination.Medicine").Preload("BillItems.Examination.Patient").Preload("PatientRight").Preload("PayType").Preload("Employee").Raw("SELECT * FROM bills").Find(&bills).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bills})
}