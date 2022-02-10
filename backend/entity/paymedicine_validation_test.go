package entity

import (
	"fmt"
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

// ตรวจสอบหมายเลข PID ต้องขึ้นด้วย 1 ถึง 9 และตามด้วย 0 ถึง 9 จำนวน 12 ตัว
func TestPidMustBeInValidPattern(t *testing.T) {
	g := NewGomegaWithT(t)

	fixtures := []string{
		"0000000000000",
		"0123456654321",
		"000000000000",
		"100000000000",
		"10000000000000",
		"10000000000x",
		"0",
		"xxxxxxxxxxxxx",
	}

	for _, fixture := range fixtures {
		paymedicine := PayMedicine{
			PayMedicineTime: time.Date(2023, 1, 1, 12, 00, 00, 00, time.UTC),
			Prescription:    12345,
			Pid:             fixture, // ผิด
		}

		ok, err := govalidator.ValidateStruct(paymedicine)

		// ok ต้องไม่เป็น true แปลว่าต้องจับ error ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็น nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error() ต้องมี message แสดงออกมา
		g.Expect(err.Error()).To(Equal(fmt.Sprintf(`Pid: %s does not validate as matches(^[1-9]\d{12}$)`, fixture)))
	}
}

func TestPayMedicinePrescription(t *testing.T) {
	g := NewGomegaWithT(t)

	paymedicine := PayMedicine{
		PayMedicineTime: time.Date(2023, 1, 1, 12, 00, 00, 00, time.UTC),
		Prescription:    0, //ผิดต้องมีค่ามากกว่า 0
		Pid:             "1489900000001",
	}

	//ตรวจสอบ govalidator
	ok, err := govalidator.ValidateStruct(paymedicine)

	// ok ต้องไม่เป็น true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็น nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Prescription more than 0 and cannot be blank"))

}

func TestPayMedicineTimeMustBeNotPast(t *testing.T) {
	g := NewGomegaWithT(t)

	paymedicine := PayMedicine{
		PayMedicineTime: time.Date(2019, 1, 1, 12, 00, 00, 00, time.UTC),
		Prescription:    12345,
		Pid:             "1489900000001",
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
