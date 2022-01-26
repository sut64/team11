package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sut64/team11/entity"
)

// POST /bills
func CreateBill(c *gin.Context) {

	//var billitem entity.BillItem
	var paytype entity.PayType
	var patientright entity.PatientRight
	var employee entity.Employee
	var bill entity.Bill
	
	
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
		c.JSON(http.StatusBadRequest, gin.H{"error": "cashier not found"})
		return
	}

	
		
	// 12: สร้าง Bill
	bl := entity.Bill{       
		PatientRight:       patientright,                  // โยงความสัมพันธ์กับ Entity PatientRight
		PayType : paytype,                   // โยงความสัมพันธ์ Entity Paytype
		Employee:    employee,               // โยงความสัมพันธ์กับ Entity Crashier
		BillTime: bill.BillTime, // ตั้งค่าฟิลด์ BillTime
		Total: bill.Total - patientright.Discount,  //ตั้งค่าฟิลด์ Total
		Telephone : bill.Telephone,
	}

	// 13: บันทึก
	if err := entity.DB().Create(&bl).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": bl})
}
// GET /bill/:id
func GetBill(c *gin.Context) {
	var bill entity.Bill
	id := c.Param("id")
	if err := entity.DB().Preload("Paytype").Preload("BillItem").Preload("PatientRight").Preload("Employee").Raw("SELECT * FROM bills WHERE id = ?", id).Find(&bill).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": bill})
}

// GET /bills
func ListBills(c *gin.Context) {
	var bills []entity.Bill
	if err := entity.DB().Preload("Paytype").Preload("BillItem").Preload("PatientRight").Preload("Employee").Raw("SELECT * FROM bills").Find(&bills).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": bills})
}