package entity

import (
	"fmt"
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestPayMedicinePass(t *testing.T) {
	g := NewGomegaWithT(t)

	//ข้อมูลที่ถูกต้องหมดทุก field
	paymedicine := PayMedicine{
		PayMedicineTime: time.Date(2023, 1, 1, 12, 00, 00, 00, time.UTC),
		Cost:            120,
		Prescription:    "10000001",
	}

	//ตรวจสอบ govalidator
	ok, err := govalidator.ValidateStruct(paymedicine)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).To(BeTrue())

	// err เป็นค่า nil แปลว่าไม่มี error
	g.Expect(err).To(BeNil())
}

// ตรวจสอบหมายเลข Prescription ต้องขึ้นด้วย 1 ถึง 9 และตามด้วย 0 ถึง 9 จำนวน 7 ตัว
func TestPresciptionMustBeInValidPattern(t *testing.T) {
	g := NewGomegaWithT(t)

	fixtures := []string{
		"000000",
		"012345",
		"000000",
		"100000",
		"1000000",
		"100000x",
		"0",
		"xxxxxxx",
	}

	for _, fixture := range fixtures {
		paymedicine := PayMedicine{
			PayMedicineTime: time.Date(2023, 1, 1, 12, 00, 00, 00, time.UTC),
			Cost:            123,
			Prescription:    fixture, // ผิด
		}

		ok, err := govalidator.ValidateStruct(paymedicine)

		// ok ต้องไม่เป็น true แปลว่าต้องจับ error ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็น nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error() ต้องมี message แสดงออกมา
		g.Expect(err.Error()).To(Equal(fmt.Sprintf(`Prescription: %s does not validate as matches(^[1-9]\d{7}$)`, fixture)))
	}
}

func TestPayMedicineCost(t *testing.T) {
	g := NewGomegaWithT(t)

	paymedicine := PayMedicine{
		PayMedicineTime: time.Date(2023, 1, 1, 12, 00, 00, 00, time.UTC),
		Cost:            0, //ผิดต้องมีค่ามากกว่า 0
		Prescription:    "10000001",
	}

	//ตรวจสอบ govalidator
	ok, err := govalidator.ValidateStruct(paymedicine)

	// ok ต้องไม่เป็น true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็น nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Cost more than 0 and cannot be blank"))

}

func TestPayMedicineTimeMustBeNotPast(t *testing.T) {
	g := NewGomegaWithT(t)

	paymedicine := PayMedicine{
		PayMedicineTime: time.Date(2019, 1, 1, 12, 00, 00, 00, time.UTC),
		Cost:            123,
		Prescription:    "10000001",
	}

	//ตรวจสอบ govalidator
	ok, err := govalidator.ValidateStruct(paymedicine)

	// ok ต้องไม่เป็น true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็น nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("PayMedicineTime must be in the future"))

}
